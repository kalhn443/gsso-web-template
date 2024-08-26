#!/bin/bash

SCRIPT_DIR=$(dirname "$(readlink -f "$0")")
CONFIGDIR="../configs"

#=====// FUNCTION DEFINITIONS //=====#

get_pid() {
    # Function to get PID of the application
    ps -ef | grep -i " ${1} " | egrep -v "grep|appCtl|log|guard" | awk '{print $2}'
}

start_app() {

    local PID=$(get_pid "${1}")
    if [ -n "${PID}" ]; then
        echo "Application already started with PID ${PID}"
        exit 1
    else
        nohup "${1}"  &>/dev/null &
        echo "Application ${1} started successfully."
    fi
}

reload_app() {
    local PID=$(get_pid "${1}")
    if [ -z "${PID}" ]; then
        echo "Application not started"
        return 1
    else
        kill -1 "${PID}"
        echo "Application ${1} reloaded successfully."
    fi
}

stop_app() {
    local PID=$(get_pid "${1}")
    if [ -z "${PID}" ]; then
        echo "Application not started"
        return 1
    else
        # Attempt to gracefully stop the application
        ps -ef | grep -i " ${1} " | egrep -v "grep|appCtl|log" | awk '{print $2}' | xargs kill -15
        sleep 2

        # Loop until the application is stopped
        while [ -n "$(get_pid "${1}")" ]; do
            echo "Graceful stop failed, force stopping..."
            ps -ef | grep -i " ${1} " | egrep -v "grep|appCtl|log" | awk '{print $2}' | xargs kill -9
            sleep 1
        done

        echo "Application ${1} stopped successfully."
    fi
}

status_app() {
    local PID=$(get_pid "${1}")
    if [ -z "${PID}" ]; then
        echo "Application not started"
        exit 1
    else
        echo "Application is running with PID ${PID}"
        ps -ef | grep -i " ${1} " | egrep -v "grep|appCtl|log"
    fi
}

#=====// MAIN LOGIC //=====#

# Check input arguments
if [ $# -lt 2 ]; then
    echo "Usage: ./appCtl.sh [start|stop|reload|status] [Application Name] [extend config name (optional)]"
    exit 1
fi


cd "${SCRIPT_DIR}"

COMMAND="${1}"
APP_NAME="${2}"
CONFIGFILE="${CONFIGDIR}/config_${APP_NAME}.json"

# Determine configuration file based on optional parameter
if [ "${COMMAND}" == "start" ] && [ $# -eq 3 ]; then
    CONFIGFILE="${CONFIGDIR}/config_${3}.json"
fi

# Check if binary exists when starting the app
if [ "${COMMAND}" == "start" ] && [ ! -f "${APP_NAME}" ]; then
    echo "Error: Binary not found: ${APP_NAME}"
    exit 1
fi

# Check if configuration file exists
if [ "${COMMAND}" == "start" ] && [ ! -f "${CONFIGFILE}" ]; then
    echo "Error: Config file not found: ${CONFIGFILE}"
    exit 1
fi


# Perform the requested command
case "${COMMAND}" in
    start)
        start_app "./${APP_NAME}"
        ;;
    stop)
        stop_app "./${APP_NAME}"
        ;;
    reload)
        reload_app "./${APP_NAME}"
        ;;
    status)
        status_app "./${APP_NAME}"
        ;;
    restart)
         stop_app "./${APP_NAME}"
         start_app "./${APP_NAME}" "${CONFIGFILE}"
         ;;
    *)
        echo "Invalid command: ${COMMAND}. Use [start|stop|reload|status|restart]"
        exit 1
        ;;
esac

#=====// END //=====#
