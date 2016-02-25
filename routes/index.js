var express = require('express');
var router = express.Router();

var fillPdf = require("fill-pdf");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/genPDF', function(req, res, next) {
  var sampleData = {
    accessionNo_26 : "97531"
  };

  console.log(req.body);

  fillPdf.generatePdf(sampleData, "../../1500template.pdf", function(err, output) {
    if ( !err ) {
      res.type("application/pdf");
      if (req.body.outputType == "inline") {
          res.setHeader('Content-disposition', 'inline; filename=someName.pdf');
      }
      else {
          res.setHeader('Content-disposition', 'attachment; filename=someName.pdf');
      }

      res.send(output);
    }
  });

})

module.exports = router;
