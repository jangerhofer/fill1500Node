var express = require('express')
var router = express.Router()

var fillPdf = require("fill-pdf")

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    title: '1500 Form Generator'
  })
})

// Login
router.post('/login', function(req, res, next) {
  if (req.body.username && req.body.username === 'CHGUser' && req.body.password && req.body.password === 'Rocket!2801') {
    req.session.authenticated = true
    res.redirect('/fill')
  } else {
    res.render('index', {
      error: "Wrong combination.  Try again!"
    })
  }
})

router.get('/fill', function(req, res, next) {
  res.render('fillForm', {
    title: '1500 Form Generator'
  })
})

router.post('/genPDF', function(req, res, next) {
  par = req.body


  for (var key in par) {
    if (!par.hasOwnProperty(key)) continue
    par[key] = par[key].toUpperCase()
}


  var formData = {
    accessionNo_26: par.accessionNumber,
    providerNPINo_17b: par.providerNPI,
    providerName_17: par.providerName,
    patientName_2: par.patientLastName + ", " + par.patientFirstName + " " + par.patientMiddleInitial,
    patientDOBMM_3: par.patientDOBMM,
    patientDOBDD_3: par.patientDOBDD,
    patientDOBYY_3: par.patientDOBYY,
    patientSex_3: par.patientGender,
    patientRelationshipToInsured_6 : par.relationshipToInsured,
    patientAreaCode_5: par.patientAreaCode,
    insuredAreaCode_7: par.patientAreaCode,
    patientPhoneNo_5: par.patientPhoneNo,
    insuredPhoneNo_7: par.patientPhoneNo,
    patientAddress_5: par.patientStreetAddress,
    insuredAddress_7: par.patientStreetAddress,
    patientCity_5: par.patientCity,
    insuredCity_7: par.patientCity,
    patientState_5: par.patientState,
    insuredState_7: par.patientState,
    patientZip_5: par.patientZip,
    insuredZip_7: par.patientZip,
    collectionDateFromMM_24: par.collectionDateFromMM,
    collectionDateFromDD_24: par.collectionDateFromDD,
    collectionDateFromYY_24: par.collectionDateFromYY,
    collectionDateToMM_24: par.collectionDateToMM,
    collectionDateToDD_24: par.collectionDateToDD,
    collectionDateToYY_24: par.collectionDateToYY,
    insuredEmployerName_11: par.insuredEmployerName,
    insuranceCarrier1: par.insuranceCarrier1,
    insuranceCarrier1Address: par.insuranceCarrier1Address,
    subscriber1Name_4: par.subscriber1Name,
    subscriber1DOBMM_11: par.subscriber1DOBMM,
    subscriber1DOBDD_11: par.subscriber1DOBDD,
    subscriber1DOBYY_11: par.subscriber1DOBYY,
    subscriber1Sex_11a : par.subscriber1Gender,
    subscriber1ID_1: par.subscriber1ID,
    subscriber1GroupNo_11: par.groupNumber1,
    chargeCode_24: par.chargeCode,
    chargeUnits_24: par.chargeUnits,
    chargeModifier_24: par.chargeModifier,
    chargeAmount_24: par.chargeAmount,
    chargeDX1_21: par.chargeDX1,
    chargeDX2_21: par.chargeDX2,
    chargeDX3_21: par.chargeDX3,
    chargeDX4_21: par.chargeDX4,
    serviceNPINo_32a : par.serviceNPINo,
    billingNPINo_33a : par.billingNPINo,
    billingPhoneAreaCode_33 : par.billingPhoneAreaCode,
    billingPhoneNo_33 : par.billingPhoneNo
  }

  fillPdf.generatePdf(formData, "../../1500template.pdf", function(err, output) {
    if (err) {
      console.log("ERROR at: " + new Date())
    }
    if (!err) {
      res.type("application/pdf")
      if (par.submitType == "dl") {
        res.setHeader('Content-disposition', 'attachment filename=' + formData.accessionNo_26 + '.pdf')
      } else {
        res.setHeader('Content-disposition', 'inline filename=' + formData.accessionNo_26 + '.pdf')
      }
      console.log(par.submitType + " at: " + new Date())
      res.send(output)
    }
  })
})

router.get('/genPDF', function(req, res, next) {
  res.redirect("/")
})

module.exports = router
