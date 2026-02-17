pipeline {
    agent any

    environment {
        IMAGE_TAG    = "${BUILD_NUMBER}"
        AWS_REGION   = "ap-southeast-1"
        ECR_REGISTRY = "541645813745.dkr.ecr.ap-southeast-1.amazonaws.com"
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

                withCredentials([
                    [
                        $class: 'AmazonWebServicesCredentialsBinding',
                        credentialsId: 'aws-credentials',
                        accessKeyVariable: 'AWS_ACCESS_KEY_ID',
                        secretKeyVariable: 'AWS_SECRET_ACCESS_KEY'
                    ]
                ]) {

                    sh """
                        aws ecr get-login-password --region ${AWS_REGION} \
                        | docker login --username AWS --password-stdin ${ECR_REGISTRY}

                        docker push ${ECR_REGISTRY}/backend:${IMAGE_TAG}
                        docker push ${ECR_REGISTRY}/backend:latest

                        docker rmi backend:${IMAGE_TAG} \
                                   ${ECR_REGISTRY}/backend:${IMAGE_TAG} \
                                   ${ECR_REGISTRY}/backend:latest || true
                    """
                }

            }
        }

    }

    post {

        always {
            sh "docker rmi ${ECR_REGISTRY}/backend:${IMAGE_TAG} || true"
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
