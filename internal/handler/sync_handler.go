package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"media-sequencer/internal/repository"
	"media-sequencer/internal/scheduler"
)

type SyncRequest struct {
	MediaID  uint `json:"mediaId" binding:"required"`
	Duration int  `json:"duration" binding:"required"`
}

func SyncPlayback(c *gin.Context) {
	var req SyncRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	media, err := repository.GetMediaByID(req.MediaID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Media not found"})
		return
	}

	scheduler.TriggerSync(*media, req.Duration)

	c.JSON(http.StatusOK, gin.H{"status": "sync started"})
}
