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

Anbei eine kurze Dokumentation, wie Du deployen kannst. Dazu einige Anmerkungen.

### Grundsätzliches Vorgehen

- Image lokal bauen, exportieren, hochladen, importieren.
- Alten Container stoppen, neuen Container starten
- Ich benutze im Image- und Containernamen jeweils das Datum des master-Commits,
  damit sich die Sachen zuordnen lassen. Commit-Hash wäre präziser, aber
  Datum reicht normalerweise, und ist sortierbar. Der aktuellste Commit
  auf dem react-Branch des mmt-Projektes ist beispielsweise 20220915. Zur Not
  kann man noch -1, -2, etc. dranhängen.
- Auf dem Server heisst das Kommando podman, nicht docker. Verwendung ist sonst dieselbe.

### Konkretes Vorgehen

#### Auf Deinem Laptop

```console
$ git clone git@gitlab.cedis.fu-berlin.de:dis/mmt.git
$ cd mmt
```

Image bauen. Als Tag nutze ich aktuell das Datum des Commits, da sich
dieses sortieren laesst. Ggf. -1, -2, etc. anhaengen.

```console
$ docker build -t mmt:20220915 .
```

Image exportieren.

```console
$ docker image save -o mmt-20220915.tar mmt:20220915
```

Image auf den Server kopieren, importieren und Archiv wieder löschen.
Achtung: podman, nicht docker.

```console
$ scp mmt-20220915.tar deploy@ohd-av.cedis.fu-berlin.de:
```

#### Auf dem Server

```console
$ ssh deploy@ohd-av.cedis.fu-berlin.de
$ podman image load -i mmt-20220915.tar
$ rm mmt-20220915.tar
```

Im Verzeichnis /home/deploy/podman/mmt liegt ein Shell-Skript zum Starten des Containers.
Vorher muss der laufende Container beendet werden.

```console
$ podman ps    # -> Alter container: mmt-20221130
$ podman stop mmt-20221130
$ cd podman/mmt
$ ./create-mmt 20220915
```
