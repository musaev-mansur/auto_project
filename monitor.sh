#!/bin/bash

# CarsPark Health Monitor Script
# Monitors application health and restarts services if needed

PROJECT_DIR="/opt/carspark"
LOG_FILE="$PROJECT_DIR/logs/monitor.log"
HEALTH_URL="http://localhost/health"
MAX_FAILURES=3
FAILURE_COUNT=0

# Log function
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> $LOG_FILE
}

# Check health endpoint
check_health() {
    if curl -f -s $HEALTH_URL > /dev/null 2>&1; then
        return 0
    else
        return 1
    fi
}

# Restart services
restart_services() {
    log "Restarting services due to health check failure"
    cd $PROJECT_DIR
    docker-compose -f docker-compose.prod.yml restart
    sleep 30
}

# Main monitoring loop
log "Starting CarsPark health monitor"

while true; do
    if check_health; then
        if [ $FAILURE_COUNT -gt 0 ]; then
            log "Health check passed - resetting failure count"
            FAILURE_COUNT=0
        fi
    else
        FAILURE_COUNT=$((FAILURE_COUNT + 1))
        log "Health check failed (attempt $FAILURE_COUNT/$MAX_FAILURES)"
        
        if [ $FAILURE_COUNT -ge $MAX_FAILURES ]; then
            log "Maximum failures reached - restarting services"
            restart_services
            FAILURE_COUNT=0
        fi
    fi
    
    sleep 60
done
