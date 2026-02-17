pipeline {
    agent any

    environment {
        IMAGE_TAG = "${BUILD_NUMBER}"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                sh """
                    docker build -t backend:${IMAGE_TAG} .
                    docker tag backend:${IMAGE_TAG} ${ECR_REGISTRY}/backend:${IMAGE_TAG}
                    docker tag backend:${IMAGE_TAG} ${ECR_REGISTRY}/backend:latest
                """
            }
        }

        stage('Pushing to ECR') {
            steps {
                sh """
                    # Login to ECR
                    aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${ECR_REGISTRY}

                    # Push the tags
                    docker push ${ECR_REGISTRY}/backend:${IMAGE_TAG}
                    docker push ${ECR_REGISTRY}/backend:latest

                    # Remove all local tags for this image
                    docker rmi backend:${IMAGE_TAG} ${ECR_REGISTRY}/backend:${IMAGE_TAG} ${ECR_REGISTRY}/backend:latest || true
                """
            }
        }
    }

    post {
        always {
            sh 'docker rmi ${ECR_REGISTRY}/backend:${IMAGE_TAG} || true'
            cleanWs()
        }

        success {
            echo 'Backend image is pushed to the ECR!'
        }

        failure {
            echo 'Backend pipeline failed!'
        }
    }
}