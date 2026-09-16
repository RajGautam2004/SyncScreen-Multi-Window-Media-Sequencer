package domain

type PlaylistItem struct {
	ID            uint `gorm:"primaryKey" json:"id"`
	WindowID      uint `json:"windowId"`
	MediaID       uint `json:"mediaId"`
	SequenceOrder int  `json:"sequenceOrder"`
}
