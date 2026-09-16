package domain

type Window struct {
	ID                  uint   `gorm:"primaryKey" json:"id"`
	Name                string `json:"name"`
	CurrentMediaID      uint   `json:"currentMediaId"`
	PlaybackStartTime   int64  `json:"playbackStartTime"`
}
