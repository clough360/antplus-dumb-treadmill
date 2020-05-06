## raspberry pi set up

### install node
make sure your system date is correct
curl -sL https://deb.nodesource.com/setup_13.x | sudo -E bash -
sudo apt-get install -y nodejs

### install libusb
sudo apt-get install build-essential libudev-dev

### install pigpio
sudo apt-get install pigpio
