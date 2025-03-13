group "default" {
  targets = ["image-manifest"]
}

target "image-manifest" {
  inherits = ["_common"]
  platforms = ["linux/amd64", "linux/arm64"]
}

target "_common" {
  pull = true
  args = {
    BASE_IMAGE = "jocxfin/pwgen-dev"
  }
}
