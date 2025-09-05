#!/bin/bash

# CarsPark Quick Management Commands
# Usage: ./quick-commands.sh [command]

PROJECT_DIR="/opt/carspark"
COMPOSE_FILE="docker-compose.prod.yml"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

cd $PROJECT_DIR

case "$1" in
    "start")
        echo -e "${BLUE}🚀 Starting CarsPark services...${NC}"
        docker-compose -f $COMPOSE_FILE up -d
        ;;
    "stop")
        echo -e "${YELLOW}⏹️ Stopping CarsPark services...${NC}"
        docker-compose -f $COMPOSE_FILE down
        ;;
    "restart")
        echo -e "${BLUE}🔄 Restarting CarsPark services...${NC}"
        docker-compose -f $COMPOSE_FILE restart
        ;;
    "status")
        echo -e "${BLUE}📊 CarsPark Services Status:${NC}"
        docker-compose -f $COMPOSE_FILE ps
        echo ""
        echo -e "${BLUE}📈 System Resources:${NC}"
        echo "Memory Usage:"
        free -h
        echo ""
        echo "Disk Usage:"
        df -h
        ;;
    "logs")
        echo -e "${BLUE}📋 Showing logs (Ctrl+C to exit)...${NC}"
        docker-compose -f $COMPOSE_FILE logs -f
        ;;
    "logs-nginx")
        echo -e "${BLUE}📋 Nginx logs:${NC}"
        docker-compose -f $COMPOSE_FILE logs -f nginx
        ;;
    "logs-backend")
        echo -e "${BLUE}📋 Backend logs:${NC}"
        docker-compose -f $COMPOSE_FILE logs -f backend
        ;;
    "logs-frontend")
        echo -e "${BLUE}📋 Frontend logs:${NC}"
        docker-compose -f $COMPOSE_FILE logs -f frontend
        ;;
    "logs-db")
        echo -e "${BLUE}📋 Database logs:${NC}"
        docker-compose -f $COMPOSE_FILE logs -f db
        ;;
    "update")
        echo -e "${BLUE}🔄 Updating CarsPark...${NC}"
        git pull
        docker-compose -f $COMPOSE_FILE build --no-cache
        docker-compose -f $COMPOSE_FILE up -d
        ;;
    "backup")
        echo -e "${BLUE}💾 Creating backup...${NC}"
        ./backup.sh
        ;;
    "ssl-renew")
        echo -e "${BLUE}🔐 Renewing SSL certificate...${NC}"
        ./ssl-renew.sh
        ;;
    "shell-backend")
        echo -e "${BLUE}🐚 Opening backend shell...${NC}"
        docker-compose -f $COMPOSE_FILE exec backend bash
        ;;
    "shell-db")
        echo -e "${BLUE}🐚 Opening database shell...${NC}"
        docker-compose -f $COMPOSE_FILE exec db psql -U postgres carspark_db
        ;;
    "create-admin")
        echo -e "${BLUE}👤 Creating admin user...${NC}"
        docker-compose -f $COMPOSE_FILE exec backend python manage.py createsuperuser
        ;;
    "migrate")
        echo -e "${BLUE}🗄️ Running database migrations...${NC}"
        docker-compose -f $COMPOSE_FILE exec backend python manage.py migrate
        ;;
    "collectstatic")
        echo -e "${BLUE}📁 Collecting static files...${NC}"
        docker-compose -f $COMPOSE_FILE exec backend python manage.py collectstatic --noinput
        ;;
    "health")
        echo -e "${BLUE}🏥 Checking application health...${NC}"
        if curl -f -s http://localhost/health > /dev/null 2>&1; then
            echo -e "${GREEN}✅ Application is healthy${NC}"
        else
            echo -e "${RED}❌ Application is not responding${NC}"
        fi
        ;;
    "cleanup")
        echo -e "${BLUE}🧹 Cleaning up Docker resources...${NC}"
        docker system prune -f
        docker volume prune -f
        ;;
    "monitor")
        echo -e "${BLUE}📊 Starting system monitor...${NC}"
        watch -n 5 'docker-compose -f $COMPOSE_FILE ps && echo "" && free -h && echo "" && df -h'
        ;;
    *)
        echo -e "${BLUE}CarsPark Management Commands${NC}"
        echo ""
        echo -e "${GREEN}Service Management:${NC}"
        echo "  start          - Start all services"
        echo "  stop           - Stop all services"
        echo "  restart        - Restart all services"
        echo "  status         - Show service status and system resources"
        echo ""
        echo -e "${GREEN}Logs:${NC}"
        echo "  logs           - Show all logs (follow mode)"
        echo "  logs-nginx     - Show nginx logs"
        echo "  logs-backend   - Show backend logs"
        echo "  logs-frontend  - Show frontend logs"
        echo "  logs-db        - Show database logs"
        echo ""
        echo -e "${GREEN}Maintenance:${NC}"
        echo "  update         - Update application from git"
        echo "  backup         - Create backup"
        echo "  ssl-renew      - Renew SSL certificate"
        echo "  cleanup        - Clean up Docker resources"
        echo ""
        echo -e "${GREEN}Database:${NC}"
        echo "  migrate        - Run database migrations"
        echo "  collectstatic  - Collect static files"
        echo "  create-admin   - Create admin user"
        echo ""
        echo -e "${GREEN}Shell Access:${NC}"
        echo "  shell-backend  - Open backend container shell"
        echo "  shell-db       - Open database shell"
        echo ""
        echo -e "${GREEN}Monitoring:${NC}"
        echo "  health         - Check application health"
        echo "  monitor        - Start system monitor"
        echo ""
        echo -e "${YELLOW}Usage: ./quick-commands.sh [command]${NC}"
        ;;
esac
