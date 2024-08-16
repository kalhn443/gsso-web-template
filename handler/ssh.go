package handler

import (
	"api-fiber-gorm/config"
	"bytes"
	"fmt"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/sftp"
	"golang.org/x/crypto/ssh"
	"log"
	"regexp"
	"strings"
	"time"
)

type ProvRequest struct {
	Site      string `json:"site"`
	ServiceID string `json:"serviceId"`
	Data      string `json:"data"`
}

func Prov(c *fiber.Ctx) error {

	var req ProvRequest

	if err := c.BodyParser(&req); err != nil {
		return c.Status(500).JSON(fiber.Map{"status": "error", "message": "Review your input", "error": err})
	}

	appName := config.Config("SSH_SERVER_IT_APP_NAME")
	if strings.ToLower(req.Site) == "vas" {
		appName = config.Config("SSH_SERVER_VAS_APP_NAME")
	}

	client, err := getSSHClient(req.Site)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"status": "error", "message": "Failed to dial", "error": err})
	}
	defer client.Close()

	filePath := "/opt/equinox/tmp/" + req.ServiceID

	if err := writeFileOnRemote(client, filePath, req.Data); err != nil {
		return c.Status(500).JSON(fiber.Map{"status": "error", "message": "Failed to write file", "error": err})
	}

	e01Port, err := runCommand(client, fmt.Sprintf(`grep -oP '<httpd.*port="\K\d+' /opt/equinox/conf/%s.E01*`, appName))
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"status": "error", "message": "Failed to run command get port", "error": err})
	}

	result, err := provisionE01(client, e01Port, filePath, "add")
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"status": "error", "message": "Failed to run command provision", "error": err})
	}

	resultDesc, err := checkResultProv(result)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"status": "error", "message": "Failed to check result", "error": err})
	}
	if resultDesc == "ENTRY_ALREADY_EXISTS" {
		result, err = provisionE01(client, e01Port, filePath, "replace")
		if err != nil {
			return c.Status(500).JSON(fiber.Map{"status": "error", "message": "Failed to run command provision", "error": err})
		}

		resultDesc, err = checkResultProv(result)
		if err != nil {
			return c.Status(500).JSON(fiber.Map{"status": "error", "message": "Failed to check provision", "error": err})
		}
	}

	if resultDesc != "SUCCESS" {
		return c.Status(500).JSON(fiber.Map{"status": "error", "message": "Failed to run command provision", "error": err})
	}
	// gen now date format yyyyMMdd_HHmm
	date := time.Now().Format("20060102_1504")

	_, err = runCommand(client, fmt.Sprintf(`/opt/equinox/bin/E01 %s 0 0 backup %s_E01%s`, appName, appName, date))
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"status": "error", "message": "Failed to run command backup", "error": err})
	}

	return c.JSON(fiber.Map{"status": "success", "message": "Provisioning success", "data": nil})
}

func writeFileOnRemote(sshClient *ssh.Client, remoteFilePath, content string) error {
	// สร้าง SFTP client
	sftpClient, err := sftp.NewClient(sshClient)
	if err != nil {
		return fmt.Errorf("failed to create SFTP client: %v", err)
	}
	defer sftpClient.Close()

	// สร้างหรือเปิดไฟล์บน remote server
	remoteFile, err := sftpClient.Create(remoteFilePath)
	if err != nil {
		return fmt.Errorf("failed to create remote file: %v", err)
	}
	defer remoteFile.Close()

	// เขียนเนื้อหาลงในไฟล์
	_, err = remoteFile.Write([]byte(content))
	if err != nil {
		return fmt.Errorf("failed to write to remote file: %v", err)
	}

	return nil
}
func getE01Port(client *ssh.Client) ([]byte, error) {
	// Create a new session
	session, err := client.NewSession()
	if err != nil {
		return nil, err
	}

	// Run the command
	e01Port, err := session.CombinedOutput(`grep -oP '<httpd.*port="\K\d+' /opt/equinox/conf/GSSO.E01*`)
	if err != nil {
		return nil, err
	}

	// Close the session
	session.Close()

	return e01Port, nil
}
func runCommand(client *ssh.Client, command string) ([]byte, error) {
	// Create a new session
	session, err := client.NewSession()
	if err != nil {
		return nil, err
	}
	defer session.Close()

	// Run the command
	output, err := session.CombinedOutput(command)
	if err != nil {
		return nil, err
	}

	// Close the session

	return output, nil
}

func provisionE01(client *ssh.Client, e01Port []byte, filePath string, operation string) (string, error) {
	var stdout, stderr bytes.Buffer
	session, err := client.NewSession()
	if err != nil {
		return "", err
	}
	defer session.Close()

	session.Stdout = &stdout
	session.Stderr = &stderr
	command := fmt.Sprintf("/opt/equinox/utils/e01prov -a localhost -p %s -f %s -o %s", strings.Trim(string(e01Port), "\n"), filePath, operation)

	err = session.Run(command)
	if err != nil {
		log.Printf("Failed to run command: %v", err)
		log.Printf("Stderr: %s", stderr.String())
		return "", err
	}

	return stdout.String(), nil
}

func checkResultProv(result string) (string, error) {

	re, err := regexp.Compile(`description="([^"]+)"`)
	if err != nil {
		return "", fmt.Errorf("failed to compile regex: %v", err)
	}
	matches := re.FindStringSubmatch(result)

	if len(matches) > 1 {
		return matches[1], nil
	} else {
		return "", fmt.Errorf("no matches found")
	}

}

func getSSHClient(site string) (*ssh.Client, error) {

	var host, user, pw, keyExchange string
	if strings.ToLower(site) == "it" {
		host = config.Config("SSH_SERVER_IT_HOST")
		user = config.Config("SSH_SERVER_IT_USER")
		pw = config.Config("SSH_SERVER_IT_PW")
		keyExchange = config.Config("SSH_SERVER_IT_KEY_EXCHANGES")
	} else {
		host = config.Config("SSH_SERVER_VAS_HOST")
		user = config.Config("SSH_SERVER_VAS_USER")
		pw = config.Config("SSH_SERVER_VAS_PW")
		keyExchange = config.Config("SSH_SERVER_VAS_KEY_EXCHANGES")
	}

	cfg := &ssh.ClientConfig{
		User: user,
		Auth: []ssh.AuthMethod{
			ssh.Password(pw),
		},
		HostKeyCallback: ssh.InsecureIgnoreHostKey(),
		Config: ssh.Config{
			KeyExchanges: []string{keyExchange},
		},
	}

	// เชื่อมต่อไปยัง SSH server
	client, err := ssh.Dial("tcp", host+":22", cfg)

	return client, err

}
