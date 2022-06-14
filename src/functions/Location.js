export  default function getcurrentLoc() {
    if (navigator.geolocation) {
      console.log("creating promise");
      var prom = new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition((pos) => {
          const position =
            pos.coords.latitude.toString() +
            "," +
            pos.coords.longitude.toString();
          resolve(position);
        });
      });
      return prom;
    } else {
      alert("Geolocation is not supported by this browser.");
      return "";
    }
}