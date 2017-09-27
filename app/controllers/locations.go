package controllers

import (
  "github.com/revel/revel"
  "github.com/lunchqian-api/app/models"
  "math/rand"
  "time"
)

type Locations struct {
  *revel.Controller
}

var locations = []models.Location{
  models.Location{1, "Timbre+"},
  models.Location{2, "B1"},
  models.Location{3, "Star Vista"},
}

func (c Locations) List() revel.Result {
  return c.RenderJSON(locations)
}

func (c Locations) RandomLocation() revel.Result {
  rand.Seed(time.Now().UnixNano())
  return c.RenderJSON(locations[rand.Intn(len(locations))])
}

func (c Locations) Show(locationID int) revel.Result {
  var res models.Location
  for _, location := range locations {
    if location.ID == locationID {
      res = location
    }
  }

  if res.ID == 0 {
    return c.NotFound("Could not find location")
  }

  return c.RenderJSON(res)
}
