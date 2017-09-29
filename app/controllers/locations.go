package controllers

import (
  "github.com/revel/revel"
  // "github.com/lunchqian-api/app/models"
  "github.com/flimzy/kivik"
    _ "github.com/go-kivik/couchdb"
  "math/rand"
  "time"
  "strconv"
  "context"
)

type Locations struct {
  *revel.Controller
}

// func (c Locations) List() revel.Result {
//   TODO: Update to list out all the location in db
//   return c.RenderJSON(locations)
// }

func (c Locations) Random() revel.Result {
    //TODO: shift the username and password to another place
    client, err := kivik.New(context.TODO(), "couch", "http://admin:password@localhost:5984/")
    if err != nil {
        panic(err)
    }

    db, err := client.DB(context.TODO(), "lunch_qian")
    if err != nil {
        panic(err)
    }
    rand.Seed(time.Now().UnixNano())
    num := strconv.Itoa(rand.Intn(10))
    row, err := db.Get(context.TODO(), num)
    if err != nil {
        panic(num)
    }

    var locale Locations
    if err = row.ScanDoc(&locale); err != nil {
    panic(err)
    }

    return c.RenderJSON(locale.Name)
}

// func (c Locations) Show(locationID int) revel.Result {
//   var res models.Location
//   for _, location := range locations {
//     if location.ID == locationID {
//       res = location
//     }
//   }

//   if res.ID == 0 {
//     return c.NotFound("Could not find location")
//   }

//   return c.RenderJSON(res)
// }
