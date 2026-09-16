package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"media-sequencer/internal/domain"
	"media-sequencer/internal/repository"
)

func GetWindows(c *gin.Context) {
	windows, err := repository.GetAllWindows()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, windows)
}

func CreateWindow(c *gin.Context) {
	var window domain.Window
	if err := c.ShouldBindJSON(&window); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := repository.CreateWindow(&window); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, window)
}
