# Media Management Tool

## Development

Run server

`npm run server`

Run client

`npm run client`

## Using Docker for production

Build Docker image

`docker build -t mmt .`

Run Docker containers

`docker compose up`

## Deployment

The following is a basic documentation on how to deploy at the moment.

### Basic procedure

- Build image locally, export, upload and import it.
- Stop old container, start new container
- I usually create a git tag before deploying a new version. The same
  tag is then used in the image and container names.
- On our server the command is podman, not docker. The usage is the same.

### Step-by-step guide

#### On your local computer

```console
$ git clone git@github.com:oral-history-digital/mmt.git
$ cd mmt
```

Build image. You can use the git tag as image tag, e.g.

```console
$ docker build -t mmt:v0.9.0 .
```

Export image.

```console
$ docker image save -o mmt-v0.9.0.tar mmt:v0.9.0
```

Copy the image to the server, import it and delete the archive.
Attention: podman, not docker.

```console
$ scp mmt-v0.9.0.tar deploy@example.com:
```

#### On the server

```console
$ ssh deploy@example.com
$ podman image load -i mmt-v0.9.0.tar
$ rm mmt-v0.9.0.tar
```

On our server, in the directory /home/deploy/podman/mmt there is a shell
script to start the container. Before, you have to stop the running container.

```console
$ podman ps    # -> Old container: mmt-v0.8.1
$ podman stop mmt-v0.8.1
$ cd podman/mmt
$ ./create-mmt v0.9.0
```
