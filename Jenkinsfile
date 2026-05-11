pipeline {
    agent any

    environment {
        DOCKER_USERNAME = credentials('docker-username')
        DOCKER_PASSWORD = credentials('docker-password')
        APP_NAME = 'medicare'
        BACKEND_IMAGE = "${DOCKER_USERNAME}/medicare-backend"
        FRONTEND_IMAGE = "${DOCKER_USERNAME}/medicare-frontend"
    }

    stages {

        // ─────────────────────────────
        // STAGE 1 : Récupérer le code
        // ─────────────────────────────
        stage('📥 Checkout') {
            steps {
                echo '📥 Récupération du code source...'
                checkout scm
                echo '✅ Code récupéré avec succès !'
            }
        }

        // ─────────────────────────────
        // STAGE 2 : Test Backend
        // ─────────────────────────────
        stage('🧪 Test Backend') {
            steps {
                echo '🧪 Test du backend Node.js...'
                dir('backend') {
                    sh 'npm install'
                    sh 'node -c app.js'
                    sh 'echo "✅ Backend valide !"'
                }
            }
        }

        // ─────────────────────────────
        // STAGE 3 : Test Frontend
        // ─────────────────────────────
        stage('🧪 Test Frontend') {
            steps {
                echo '🧪 Test du frontend Angular...'
                dir('frontend') {
                    sh 'npm install'
                    sh 'npm run build'
                    sh 'echo "✅ Frontend buildé avec succès !"'
                }
            }
        }

        // ─────────────────────────────
        // STAGE 4 : Build Docker
        // ─────────────────────────────
        stage('🐳 Build Docker Images') {
            steps {
                echo '🐳 Construction des images Docker...'
                sh """
                    docker build -t ${BACKEND_IMAGE}:${BUILD_NUMBER} ./backend
                    docker build -t ${FRONTEND_IMAGE}:${BUILD_NUMBER} ./frontend
                    docker tag ${BACKEND_IMAGE}:${BUILD_NUMBER} ${BACKEND_IMAGE}:latest
                    docker tag ${FRONTEND_IMAGE}:${BUILD_NUMBER} ${FRONTEND_IMAGE}:latest
                    echo '✅ Images Docker construites !'
                """
            }
        }

        // ─────────────────────────────
        // STAGE 5 : Push Docker Hub
        // ─────────────────────────────
        stage('📤 Push to Docker Hub') {
            steps {
                echo '📤 Push des images sur Docker Hub...'
                sh """
                    echo ${DOCKER_PASSWORD} | docker login -u ${DOCKER_USERNAME} --password-stdin
                    docker push ${BACKEND_IMAGE}:${BUILD_NUMBER}
                    docker push ${BACKEND_IMAGE}:latest
                    docker push ${FRONTEND_IMAGE}:${BUILD_NUMBER}
                    docker push ${FRONTEND_IMAGE}:latest
                    echo '✅ Images pushées sur Docker Hub !'
                """
            }
        }

        // ─────────────────────────────
        // STAGE 6 : Deploy
        // ─────────────────────────────
        stage('🚀 Deploy') {
            steps {
                echo '🚀 Déploiement avec Docker Compose...'
                sh """
                    docker-compose down || true
                    docker-compose pull
                    docker-compose up -d
                    echo '✅ Application déployée !'
                """
            }
        }
    }

    post {
        success {
            echo '''
            ╔══════════════════════════════════╗
            ║  ✅ PIPELINE RÉUSSI !            ║
            ║  🏥 MediCare Pro déployé !       ║
            ╚══════════════════════════════════╝
            '''
        }
        failure {
            echo '''
            ╔══════════════════════════════════╗
            ║  ❌ PIPELINE ÉCHOUÉ !            ║
            ║  Vérifier les logs !             ║
            ╚══════════════════════════════════╝
            '''
        }
        always {
            echo '🧹 Nettoyage...'
            sh 'docker system prune -f || true'
        }
    }
}