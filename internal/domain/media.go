package domain

type Media struct {
	ID              uint   `gorm:"primaryKey" json:"id"`
	Title           string `json:"title"`
	Type            string `json:"type"`
	URL             string `json:"url"`
	DurationSeconds int    `json:"durationSeconds"`
}
