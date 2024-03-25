package controller

import (
	"fmt"
	"image/png"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/makiuchi-d/gozxing"
	"github.com/makiuchi-d/gozxing/qrcode"
)

func ValidateQr(c *gin.Context) {
	file, err := os.Open("qr.png")
	if err != nil {
		panic(err)
	}
	defer file.Close()

	// Decode the Image
	img, err := png.Decode(file)
	if err != nil {
		panic(err)
	}

	// Prepare BinaryBitmap
	bitmap, _ := gozxing.NewBinaryBitmapFromImage(img)

	// Decode the Bitmap as QR Code
	decoder := qrcode.NewQRCodeReader()
	result, _ := decoder.Decode(bitmap, nil)

	// Print the result
	fmt.Println(result)
}
