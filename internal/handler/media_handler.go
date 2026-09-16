package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"media-sequencer/internal/domain"
	"media-sequencer/internal/repository"
)

func GetMedia(c *gin.Context) {
	media, err := repository.GetAllMedia()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, media)
}

func CreateMedia(c *gin.Context) {
	var media domain.Media
	if err := c.ShouldBindJSON(&media); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := repository.CreateMedia(&media); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, media)
}
