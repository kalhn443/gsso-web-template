package model

// User struct
type User struct {
	ID        uint     `gorm:"primarykey" json:"ID"`
	CreatedAt JsonTime `gorm:"type:timestamp;default:CURRENT_TIMESTAMP" json:"createdAt"`
	UpdatedAt JsonTime `gorm:"type:timestamp;default:CURRENT_TIMESTAMP" json:"updatedAt"`
	Username  string   `gorm:"uniqueIndex;not null" json:"username"`
	Email     string   `gorm:"uniqueIndex;not null" json:"email"`
	Mobile    string   `gorm:"not null" json:"mobile"`
	EmailLead string   `gorm:"not null" json:"emailLead"`
	Role      string   `gorm:"not null" json:"role,omitempty"`
	Password  string   `gorm:"not null" json:"password,omitempty"`
}
