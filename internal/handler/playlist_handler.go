package handler

import (
	"encoding/json"
	"net/http"

	"github.com/gin-gonic/gin"
	"media-sequencer/internal/domain"
	"media-sequencer/internal/repository"
	ws "media-sequencer/internal/websocket"
)

// Global reference to hub for handler events (injected during SetupRouter)
var wsHub *ws.Hub

func SetHub(h *ws.Hub) {
	wsHub = h
}

func AddToPlaylist(c *gin.Context) {
	var item domain.PlaylistItem
	if err := c.ShouldBindJSON(&item); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := repository.AddToPlaylist(&item); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Broadcast that the playlist has been updated
	if wsHub != nil {
		msg := ws.PlaylistUpdatedMsg{
			Type:     "playlist_updated",
			WindowID: item.WindowID,
		}
		b, _ := json.Marshal(msg)
		wsHub.Broadcast <- b
	}

	c.JSON(http.StatusCreated, item)
}
