# ----------
# jenkins
# ----------

# jenkins, the devops way 
    # docker, jobs DSL, and jenkins pipelines.
    # use plugins to integrate jenkins with popular development software
    # configure the authentication / authorization options to tighten security on Jenkins UI

# docker jenkins 
    # https://hub.docker.com/r/jenkins/jenkins
    # https://github.com/jenkinsci/docker/blob/master/README.md
docker run -p 8080:8080 -p 50000:50000 jenkins/jenkins:lts
docker run -p 8080:8080 -p 50000:50000 -v jenkins_home:/var/jenkins_home jenkins/jenkins:lts
docker run -d -v jenkins_home:/var/jenkins_home -p 8080:8080 -p 50000:50000 jenkins/jenkins:lts

# jenkins docs
    # https://jenkins.io/doc/

# about jenkins
    # open source CI/CD tool written in Java
    # automation server used to build/deliver software projects
    # Jenkins was forked from another project (Hudson) after a dispute with Oracle.
    # has a lot of plugins available
    # jenkins is open-source, free, and popular

# why jenkins
    # jenkins provides a feedback loop, prompting developers to fix build errors.
    # developers should fix errors immediately, as its easier when the code is still fresh in memory.
    # jenkins can publish every (passing) build. Each build will have gone through automated testing
    # when published / deployed to a dev/qa/staging server, SDLC advances much quicker
        # SDLC -- software development lifecycle

# workflow
    # code change
    # build
    # test -- unit, integration, regression, user acceptance tests 
    # release -- package (docker), provision / deploy

# installation methods
    # cloud, docker
    # locally, docker
    # locally, VM (virtualbox) (virtualbox + vagrant)

# jenkins alternatives
    # self-hosted
        # Drone CI -- CD platform written in Golang
        # TeamCity
    # hosted (service)
        # AWS CI/CD tools
        # Wercker
        # CircleCI
        # CodeShip
        # SemaphoreCI

# ----------
# GUI usage (don't do this)
# ----------

# install / start
    # get cloud instance
    # install docker on cloud instance
    # pull docker image
    # start docker image
    # go to public_ip:port in browser

# initial sign-in
    # enter password to log in
    # install suggested plugins
    # create first admin user (username, pw, full name, email)

# usage
    # install plug-ins
    # build application

# ----------
# jenkins job dsl
# ----------

# jenkins job DSL -- plugin that allows programmatic job definition
    # DSL -- domain specific language
    # describe jobs using Groovy
    # install jenkins DSL plugin
    # add script to git
    # link to script in jenkins DSL
    # authorize script
    # run script

# ----------
# jenkins pipelines
# ----------

# jenkins pipelines
    # write jenkins build steps in code
    # automate build steps
        # code change --> build --> test --> release --> provision/deploy

# pipeline vs job DSL
    # both hav the capability to write all CI/CD code
    # difference is in implmenentation.
    # job DSL -- creates new jobs (based on code).
        # job DSL can be used to produce freestyle projects (a job type)
    # pipeline (job type) -- pipeline job that will handle build/test/deploy
        # can be created using jenkins UI or jenkins job DSL
        # can be written in groovy (scripted pipeline) or Jenkins DSL (declarative pipeline)

# ----------
#
# ----------




# ----------
#
# ----------




# ----------
#
# ----------




# ----------
#
# ----------




# ----------
#
# ----------




# ----------
#
# ----------




# ----------
#
# ----------




# ----------
#
# ----------




# ----------
#
# ----------




# ----------
#
# ----------




# ----------
#
# ----------




# ----------
#
# ----------




# ----------
#
# ----------




# ----------
#
# ----------




# ----------
#
# ----------




# ----------
#
# ----------




# ----------
#
# ----------




# ----------
#
# ----------