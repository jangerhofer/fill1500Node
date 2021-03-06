var express = require('express')
var router = express.Router()

var moment = require('moment')
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
        title: '1500 Form Generator',
        moment: moment
    })
})

router.post('/genPDF', function(req, res, next) {
    par = req.body
    sumCharges = 0.00

    // Set all text to uppercase
    for (var key in par) {
        par[key] = par[key].toUpperCase()
    }


    // Remove phantom new lines
    par.serviceFacilityAddress = par.serviceFacilityAddress.replace('\r\n', '\r');

    par.billingProviderAddress = par.billingProviderAddress.replace('\r\n', '\r');

    // Check for empty charges
    for (i = 1; i <= 6; i++) {
        if (!(par["charges" + i]) || !(par["cptCode" + i])) {
            par["chargesDollars" + i] = ""
            par["chargesCents" + i] = ""
            par["providerID" + i] = ""
            par["servicePlace" + i] = ""
        } else {
            sumCharges += parseFloat(par["charges" + i])
            //par["cptCode" + i] = parseFloat(par["cptCode" + i]).toFixed(2)
            amount = par["charges" + i]
            par["chargesDollars" + i] = amount.split('.')[0]
            par["chargesCents" + i] = ((amount.split('.')[1] || '') +'00').slice(0,2)
        }
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
        patientRelationshipToInsured_6: par.relationshipToInsured,
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
        patientSignature_12: par.patientSignature,
        patientSignatureDate_12: par.patientSignatureDate,
        insuredSignature_13: par.insuredSignature,
        insuredEmployerName_11: par.insuredEmployerName,
        insuranceCarrier1: par.insuranceCarrier1,
        insuranceCarrier1Address: par.insuranceCarrier1Street,
        insuranceCarrier1CityState: par.insuranceCarrier1City + ", " + par.insuranceCarrier1State,
        insuranceCarrier1Zip: par.insuranceCarrier1Zip,
        subscriber1Name_4: par.subscriber1LastName + ", " + par.subscriber1FirstName + " " + par.subscriber1MiddleInitial,
        conditionRelatedToEmployment_10a: par.conditionRelatedToEmployment,
        conditionRelatedToAuto_10b: par.conditionRelatedToAuto,
        conditionRelatedToOther_10c: par.conditionRelatedToOther,
        subscriber1DOBMM_11: par.subscriber1DOBMM,
        subscriber1DOBDD_11: par.subscriber1DOBDD,
        subscriber1DOBYY_11: par.subscriber1DOBYY,
        subscriber1Sex_11a: par.subscriber1Gender,
        subscriber1ID_1: par.subscriber1ID,
        subscriber1GroupNo_11: par.groupNumber1,
        dateIllnessMM_14: par.dateIllnessMM,
        icdIndicator_21: par.icdIndicator,
        chargeDX1_21: par.chargeDX1,
        chargeDX2_21: par.chargeDX2,
        chargeDX3_21: par.chargeDX3,
        chargeDX4_21: par.chargeDX4,
        federalTaxIDNo_25: par.federalTaxIDNo,
        ssn_v_ein_25: par.useEIN,
        acceptAssignment_27: par.acceptAssignment,
        supplierSignature_31: par.supplierSignature,
        supplierCredential_31: par.supplierCredential,
        supplierSignatureDate_31: par.supplierSignatureDate,
        serviceFacilityAddress_32: par.serviceFacilityAddress,
        billingProviderAddress_33: par.billingProviderAddress,
        serviceNPINo_32a: par.serviceNPINo,
        billingNPINo_33a: par.billingNPINo,
        billingPhoneAreaCode_33: par.billingPhoneAreaCode,
        billingPhoneNo_33: par.billingPhoneNo,

        collectionDateFromMM_24_1: par.collectionDateFromMM1,
        collectionDateFromDD_24_1: par.collectionDateFromDD1,
        collectionDateFromYY_24_1: par.collectionDateFromYY1,
        collectionDateToMM_24_1: par.collectionDateToMM1,
        collectionDateToDD_24_1: par.collectionDateToDD1,
        collectionDateToYY_24_1: par.collectionDateToYY1,
        servicePlace_24_1: par.servicePlace1,
        cptCode_24_1: par.cptCode1,
        modifier_24_1: par.modifier1,
        diagnosis_24_1: par.diagnosis1,
        chargesDollars_24_1: par.chargesDollars1,
        chargesCents_24_1: par.chargesCents1,
        dayUnits_24_1: par.dayUnits1,
        providerID_24_1: par.providerID1,

        collectionDateFromMM_24_2: par.collectionDateFromMM2,
        collectionDateFromDD_24_2: par.collectionDateFromDD2,
        collectionDateFromYY_24_2: par.collectionDateFromYY2,
        collectionDateToMM_24_2: par.collectionDateToMM2,
        collectionDateToDD_24_2: par.collectionDateToDD2,
        collectionDateToYY_24_2: par.collectionDateToYY2,
        servicePlace_24_2: par.servicePlace2,
        cptCode_24_2: par.cptCode2,
        modifier_24_2: par.modifier2,
        diagnosis_24_2: par.diagnosis2,
        chargesDollars_24_2: par.chargesDollars2,
        chargesCents_24_2: par.chargesCents2,
        dayUnits_24_2: par.dayUnits2,
        providerID_24_2: par.providerID2,

        collectionDateFromMM_24_3: par.collectionDateFromMM3,
        collectionDateFromDD_24_3: par.collectionDateFromDD3,
        collectionDateFromYY_24_3: par.collectionDateFromYY3,
        collectionDateToMM_24_3: par.collectionDateToMM3,
        collectionDateToDD_24_3: par.collectionDateToDD3,
        collectionDateToYY_24_3: par.collectionDateToYY3,
        servicePlace_24_3: par.servicePlace3,
        cptCode_24_3: par.cptCode3,
        modifier_24_3: par.modifier3,
        diagnosis_24_3: par.diagnosis3,
        chargesDollars_24_3: par.chargesDollars3,
        chargesCents_24_3: par.chargesCents3,
        dayUnits_24_3: par.dayUnits3,
        providerID_24_3: par.providerID3,

        collectionDateFromMM_24_4: par.collectionDateFromMM4,
        collectionDateFromDD_24_4: par.collectionDateFromDD4,
        collectionDateFromYY_24_4: par.collectionDateFromYY4,
        collectionDateToMM_24_4: par.collectionDateToMM4,
        collectionDateToDD_24_4: par.collectionDateToDD4,
        collectionDateToYY_24_4: par.collectionDateToYY4,
        servicePlace_24_4: par.servicePlace4,
        cptCode_24_4: par.cptCode4,
        modifier_24_4: par.modifier4,
        diagnosis_24_4: par.diagnosis4,
        chargesDollars_24_4: par.chargesDollars4,
        chargesCents_24_4: par.chargesCents4,
        dayUnits_24_4: par.dayUnits4,
        providerID_24_4: par.providerID4,

        collectionDateFromMM_24_5: par.collectionDateFromMM5,
        collectionDateFromDD_24_5: par.collectionDateFromDD5,
        collectionDateFromYY_24_5: par.collectionDateFromYY5,
        collectionDateToMM_24_5: par.collectionDateToMM5,
        collectionDateToDD_24_5: par.collectionDateToDD5,
        collectionDateToYY_24_5: par.collectionDateToYY5,
        servicePlace_24_5: par.servicePlace5,
        cptCode_24_5: par.cptCode5,
        modifier_24_5: par.modifier5,
        diagnosis_24_5: par.diagnosis5,
        chargesDollars_24_5: par.chargesDollars5,
        chargesCents_24_5: par.chargesCents5,
        dayUnits_24_5: par.dayUnits5,
        providerID_24_5: par.providerID5,

        collectionDateFromMM_24_6: par.collectionDateFromMM6,
        collectionDateFromDD_24_6: par.collectionDateFromDD6,
        collectionDateFromYY_24_6: par.collectionDateFromYY6,
        collectionDateToMM_24_6: par.collectionDateToMM6,
        collectionDateToDD_24_6: par.collectionDateToDD6,
        collectionDateToYY_24_6: par.collectionDateToYY6,
        servicePlace_24_6: par.servicePlace6,
        cptCode_24_6: par.cptCode6,
        modifier_24_6: par.modifier6,
        diagnosis_24_6: par.diagnosis6,
        chargesDollars_24_6: par.chargesDollars6,
        chargesCents_24_6: par.chargesCents6,
        dayUnits_24_6: par.dayUnits6,
        providerID_24_6: par.providerID6,

        chargesTotDollars_28: sumCharges.toString().split('.')[0],
        chargesTotCents_28: ((sumCharges.toFixed(2).toString().split('.')[1] || '') +'00').slice(0,2)
    }

    console.log(par.serviceFacilityAddress);
    fillPdf.generatePdf(formData, "../../1500template.pdf", function(err, output) {
        if (err) {
            console.log("ERROR at: " + new Date())
        }
        if (!err) {
            res.type("application/pdf")
            if (par.submitType == "DL") {
                res.setHeader('Content-disposition', 'attachment; filename=' + par.accessionNumber + '_1500.pdf')
            } else {
                res.setHeader('Content-disposition', 'inline; filename=' + par.accessionNumber + '_1500.pdf')
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
