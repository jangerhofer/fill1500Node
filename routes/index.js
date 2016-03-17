var express = require('express');
var router = express.Router();

var fillPdf = require("fill-pdf");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    title: '1500 Form Generator'
  });
});

// Login
router.post('/login', function(req, res, next) {
  if (req.body.username && req.body.username === 'chgUser2016' && req.body.password && req.body.password === 'Rocket!2801') {
    req.session.authenticated = true;
    res.redirect('/fill');
  } else {
    res.render('index', {
      error: "Wrong combination.  Try again!"
    })
  }
});

router.get('/fill', function(req, res, next) {
  res.render('fillForm', {
    title: '1500 Form Generator'
  });
});

router.post('/genPDF', function(req, res, next) {
  par = req.body
  var formData = {
    accessionNo_26: par.accessionNumber,
    providerNPINo_17b: par.providerNPI,
    providerName_17: par.providerName,
    patientName_2: par.patientLastName + ", " + par.patientFirstName + " " + par.patientMiddleInitial
  };

  console.log(req.body);

  fillPdf.generatePdf(formData, "../../1500template.pdf", function(err, output) {
    if (!err) {
      res.type("application/pdf");
      if (par.outputType == "inline") {
        res.setHeader('Content-disposition', 'inline; filename=' + formData.accessionNo_26 + '.pdf');
      } else {
        res.setHeader('Content-disposition', 'attachment; filename=' + formData.accessionNo_26 + '.pdf');
      }

      res.send(output);
    }
  });

})

router.get('/genPDF', function(req, res, next) {
  res.redirect("/")
})

module.exports = router;
