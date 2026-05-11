#!/bin/bash

# ═══════════════════════════════════════════
# Script de déploiement - MediCare Pro
# ═══════════════════════════════════════════

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}"
echo "╔══════════════════════════════════════╗"
echo "║   🏥 MediCare Pro - Déploiement     ║"
echo "╚══════════════════════════════════════╝"
echo -e "${NC}"

# ─────────────────────────────
# 1. Vérifier Docker
# ─────────────────────────────
echo -e "${YELLOW}📋 Vérification de Docker...${NC}"
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker non installé !${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Docker disponible !${NC}"

# ─────────────────────────────
# 2. Vérifier Docker Compose
# ─────────────────────────────
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}❌ Docker Compose non installé !${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Docker Compose disponible !${NC}"

# ─────────────────────────────
# 3. Créer dossier uploads
# ─────────────────────────────
echo -e "${YELLOW}📁 Création du dossier uploads...${NC}"
mkdir -p backend/uploads
echo -e "${GREEN}✅ Dossier uploads créé !${NC}"

# ─────────────────────────────
# 4. Arrêter les containers
# ─────────────────────────────
echo -e "${YELLOW}🛑 Arrêt des containers existants...${NC}"
docker-compose down
echo -e "${GREEN}✅ Containers arrêtés !${NC}"

# ─────────────────────────────
# 5. Build les images
# ─────────────────────────────
echo -e "${YELLOW}🐳 Construction des images Docker...${NC}"
docker-compose build --no-cache
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Erreur lors du build !${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Images construites !${NC}"

# ─────────────────────────────
# 6. Lancer les containers
# ─────────────────────────────
echo -e "${YELLOW}🚀 Lancement des containers...${NC}"
docker-compose up -d
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Erreur lors du lancement !${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Containers lancés !${NC}"

# ─────────────────────────────
# 7. Vérifier les containers
# ─────────────────────────────
echo -e "${YELLOW}🔍 Vérification des containers...${NC}"
sleep 5
docker-compose ps

# ─────────────────────────────
# 8. Résultat final
# ─────────────────────────────
echo -e "${GREEN}"
echo "╔══════════════════════════════════════╗"
echo "║   ✅ DÉPLOIEMENT RÉUSSI !           ║"
echo "║                                      ║"
echo "║   🌐 Frontend : http://localhost:80  ║"
echo "║   ⚙️  Backend  : http://localhost:5000║"
echo "║   🗄️  MongoDB  : localhost:27017     ║"
echo "╚══════════════════════════════════════╝"
echo -e "${NC}"