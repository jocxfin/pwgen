group "image-manifest" {
  targets = ["pwgen-dev"]
}

target "pwgen-dev" {
  platforms = ["linux/amd64", "linux/arm64"]
  tags      = ["jocxfin/pwgen-dev:latest"]
}
