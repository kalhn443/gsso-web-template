package model

import (
	"database/sql/driver"
	"fmt"
	"gorm.io/datatypes"
	"time"
)

type JsonTime time.Time

func (t JsonTime) MarshalJSON() ([]byte, error) {
	stamp := fmt.Sprintf("\"%s\"", time.Time(t).Format("2006-01-02 15:04:05"))
	return []byte(stamp), nil
}

func (t *JsonTime) UnmarshalJSON(b []byte) error {
	ts, err := time.Parse("\"2006-01-02 15:04:05\"", string(b))
	if err != nil {
		return err
	}
	*t = JsonTime(ts)
	return nil
}

func (t JsonTime) Value() (driver.Value, error) {
	return time.Time(t), nil
}

func (t *JsonTime) Scan(value interface{}) error {
	if v, ok := value.(time.Time); ok {
		*t = JsonTime(v)
		return nil
	}
	return fmt.Errorf("can not convert %v to JsonTime", value)
}

//type ServiceTemplate struct {
//	ID                  uint           `gorm:"primarykey" json:"ID"`
//	CreatedAt           JsonTime       `gorm:"type:timestamp;default:CURRENT_TIMESTAMP" json:"createdAt"`
//	UpdatedAt           JsonTime       `gorm:"type:timestamp;default:CURRENT_TIMESTAMP" json:"updatedAt"`
//	AllowOperation      datatypes.JSON `gorm:"type:json" json:"allowOperation"`
//	ServiceName         string         `json:"serviceName"`
//	ServiceId           string         `json:"serviceId"`
//	Oper                string         `json:"oper"`
//	AllowSmsRoaming     bool           `json:"allowSmsRoaming"`
//	SmsSender           string         `json:"smsSender"`
//	SmsBodyThai         string         `json:"smsBodyThai"`
//	SmsBodyEng          string         `json:"smsBodyEng"`
//	EmailFrom           string         `json:"emailFrom"`
//	EmailSubject        string         `json:"emailSubject"`
//	EmailBody           string         `json:"emailBody"`
//	SmscDeliveryReceipt bool           `json:"smscDeliveryReceipt"`
//	WaitDR              bool           `json:"waitDR"`
//	OtpDigit            string         `json:"otpDigit"`
//	RefDigit            string         `json:"refDigit"`
//	LifeTimeoutMins     string         `json:"lifeTimeoutMins"`
//	Seedkey             string         `json:"seedkey"`
//	RefundFlag          bool           `json:"refundFlag"`
//	Owner               string         `json:"owner"`
//	UpdatedBy           string         `json:"updatedBy"`
//	Status              string         `json:"status"`
//	ProjectSite         string         `json:"projectSite"`
//}

type ServiceTemplate struct {
	ID             uint           `gorm:"primarykey" json:"ID"`
	CreatedAt      JsonTime       `gorm:"type:timestamp;default:CURRENT_TIMESTAMP" json:"createdAt"`
	UpdatedAt      JsonTime       `gorm:"type:timestamp;default:CURRENT_TIMESTAMP" json:"updatedAt"`
	AllowOperation datatypes.JSON `gorm:"type:json" json:"allowOperation"`
	ServiceName    string         `json:"serviceName"`
	ServiceId      string         `json:"serviceId"`
	OperAis        datatypes.JSON `json:"operAis"`
	OperNonAis     datatypes.JSON `json:"operNonAis"`
	OperInter      datatypes.JSON `json:"operInter"`
	Owner          string         `json:"owner"`
	UpdatedBy      string         `json:"updatedBy"`
	Status         string         `json:"status"`
	ProjectSite    string         `json:"projectSite"`
}

type ContentOper struct {
	Oper                string   `json:"oper"`
	SmsSender           string   `json:"smsSender"`
	SmsBodyThai         string   `json:"smsBodyThai"`
	SmsBodyEng          string   `json:"smsBodyEng"`
	EmailFrom           string   `json:"emailFrom"`
	EmailSubject        string   `json:"emailSubject"`
	EmailBody           string   `json:"emailBody"`
	AllowSmsRoaming     string   `json:"allowSmsRoaming"`
	SmscDeliveryReceipt string   `json:"smscDeliveryReceipt"`
	WaitDR              string   `json:"waitDR"`
	OtpDigit            string   `json:"otpDigit"`
	RefDigit            string   `json:"refDigit"`
	LifeTimeoutMins     string   `json:"lifeTimeoutMins"`
	Seedkey             string   `json:"seedkey"`
	RefundFlag          string   `json:"refundFlag"`
	State               []string `json:"state,omitempty"`
}
