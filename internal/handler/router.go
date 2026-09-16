package handler

import (
	"github.com/gin-gonic/gin"
	"github.com/gin-contrib/cors"
	"media-sequencer/internal/websocket"
)

func SetupRouter(hub *websocket.Hub) *gin.Engine {
	SetHub(hub)
	
	r := gin.Default()

	// Configure CORS for Vercel frontend and local Vite
	config := cors.DefaultConfig()
	config.AllowAllOrigins = true // For production, restrict this to your specific Vercel domain
	config.AllowMethods = []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"}
	config.AllowHeaders = []string{"Origin", "Content-Length", "Content-Type", "Authorization"}
	r.Use(cors.New(config))

	r.GET("/windows", GetWindows)
	r.POST("/windows", CreateWindow)
	
	r.GET("/media", GetMedia)
	r.POST("/media", CreateMedia)
	
	r.POST("/playlist/add", AddToPlaylist)
	r.POST("/sync", SyncPlayback)

	r.GET("/ws", func(c *gin.Context) {
		websocket.ServeWs(hub, c.Writer, c.Request)
	})

	return r
}
