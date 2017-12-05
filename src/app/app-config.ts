export const AppConfig = { 
    // 'apiBaseUrl': "/api/",
    'chatSocket': "https://localhost:5000/",
    'apiBaseUrl': "https://www.octerine.com/api/", // modify this to change API base url
    // 'apiBaseUrl': "http://localhost:1475/", // modify this to change API base url
    'defaultCurrency': 'IDR', // modify this to change currency

}

export const FirebaseConfig =  {
    apiKey: "AIzaSyDJDnfIoQlMg-IBn_m5wA_5QHcejP2Bszg",
    authDomain: "insureturn-1509529454175.firebaseapp.com",
    databaseURL: "https://insureturn-1509529454175.firebaseio.com",
    projectId: "insureturn-1509529454175",
    storageBucket: "insureturn-1509529454175.appspot.com",
    messagingSenderId: "21098362152"
}

export const FacebookConfig = {
    appId: '1694965240568009',
    xfbml: true,
    version: 'v2.8'
}

export const GoogleMapConfig = {
    apiKey: "AIzaSyCA0wo7qYwenWNCWUsBhkmWGRQBI2CiqoM",
    libraries: ["places"]
}

export const APIUrls = { // modify this only when service URL changes
    'loginWithFB': 'user/',
    'updateProfile': 'updateuser/',
    'userList': 'users/',
    "insuranceList": "policyForClaim/",
    "claimList": "userClaim/",
    "addnewClaim": "submitForClaim/",
    "claimReason": "reasonForClaim/",
    "dashboardInfo": "dashboard/",
    "getQuestion": "getquestion/",
    "uploadUserDoc": "UploadUserDoc/"
}

export const SvgIcons = {
    //for claim listing
    'cancelPolicy' : "assets/images/icons/error.svg",
    'makeClaim': "assets/images/icons/get-money.svg",
    'insuranceDetails': "assets/images/icons/insurance.svg",
    'claimDetails': "assets/images/icons/refund.svg",
    'activationLink': "assets/images/icons/smartphone.svg",
    'payment': "assets/images/icons/payment-method.svg"
}

export const PolicyStatus = { 
  
    badgeClass: { // should not modiy this
        "1": "badge badge-danger",
        "2": "badge badge-warning",
        "3": "badge badge-warning",
        "4": "badge badge-success",
        "5": "badge badge-primary"
    }
}

export const ClaimStatus = {
    label: { // modify this for changing laguage
        "0": "Processing",
        "1": "Claim Issued",
        "2": "Claim Rejected"
    },
    badgeClass: { // should not modiy this
        "0": "badge badge-warning",
        "1": "badge badge-success",
        "2": "badge badge-danger"
    }
}


export const ClaimLabels = { // modify this for changing laguage
    2: 'Theft',
    3: 'Burglary',
    4: 'Robbery',
    1: 'Accidental Damage',
    5: 'Liquid Damage'
}

export const AppLabels = { // modify this for changing laguage


    'appName': 'Insureturn',

    'buttonToCancelPolicy': 'Cancel',
    'buttonToMakePayment' : 'Make Payment',
    'buttonToViewPolicyDetails': 'View Policy Details',
    'buttonToGenerateActvLink':  'Generate Activation Link',
    'buttonToViewClaims': "View Claim Details",
    'buttonToMakeClaim': "Make Claim",
    'buttonToEditProfile': 'Edit Profile',

    'logoutButton': 'Logout',
    'fullScreenButton' : 'fullscreen',

    'profileField': {
        'email' : 'Email',
        'location': 'Location',
        'birthDay': 'Birthday',
        'firstName': 'First Name',
        'lastName': 'Last Name',
        'middleName': 'Middle Name',
        'phoneNumber': 'Phone Number',
        'passportId': 'PassPort Number',
        'ktp': 'KTP',
    },

    'confirmationText': 'Are you sure ?',
    
    'claimConfirmTexts': {
        'title' : 'You will be asked to submit following details',
        'idProof' : 'Copy of ID Card (KTP. SIM, Passport, KITAS)',
        'invoice' : 'Original Proof of Ownership',
        'fir': 'For lost: an original police report letter',
        'expenseReciept': `Official and original receipts for the costs of repair from 
                            authorized service center or replacement together with any 
                            report detailing required repairs`,
        'videoDoc': `Video documentation which explaining the chronology with true
                    statement (Make sure your webcame is working properly)`,
        'devicePhotos' : 'Photograph of damaged unit from all side angles',
        'entityPhotos' : 'Photograph of damaged (forced entry) home or car',
        'hospitalReport' : `Proof of medical record summary from Hospital for Bodily
                             Injury (loss due to robbery benefit)`,

        'confirmButton' : 'Proceed',
        'declineButton' : 'Not Now'
    
    },

    'makeClaim': {
        'title' : 'Please complete all four steps',
        'warningForRequiredField' : 'This field is required',
        'warningForRequiredDocuments' : 'Please select a file',
        'warningForFileSize' : 'The total size must not exceed X (Y)',
        'warningForInvalidFile' : 'Invalid file, suported formats are X',
        'nextButton': 'Next',
        'backButton' : 'Back',
        'step1' : {
            'title' : 'What happened ?',
            'referenceNumber' : 'Reference No',
            'reasonForClaim' : 'Reason for claim',
            'preciseReason' : 'Precise Reason',
            'incidentDate': 'Date of incident' 
        },
        'step2' : {
            'title' : 'Upload supporting documents',
        },
        'step3' : {
            'title' : `Explain what happens`,
            
        },
        'step4' : {
            'title' : 'Confirm and submit',
            'submitButton' : 'Submit Claim',
            'videoUploadProgressLabel' : 'Uploading Video Document'
        }
    },

    'commonLabels' : {
        'uploading' : 'Uploading',
        'idProof' : 'Id proof',
        'invoice' : 'Invoice',
        'fir' : 'Police report',
        'expenseReciept' : 'Repair/Replace invoice',
        'hospitalReport': 'Medical report',
        'devicePhotos': 'Device photos',
        'entityPhotos': 'Entity photos',
        'video' : 'Video doc',
        'uploadCompleted': 'Completed',
        'claimReason' : 'Reason for claim',
        'documentsSubmited': 'Documents Submitted',
        'noRecords': 'No Record Available',
        'warningForRequiredField' : 'This field is required',
        'warningForRequiredDocuments' : 'Please select a file',
        'warningForFileSize' : 'The total size must not exceed X (Y)',
        'warningForInvalidFile' : 'Invalid file, suported formats are X',
        'warninForInvalidEmail': 'Please enter a valid email address',
        'warninForInvalidKTP' : 'Please enter a valid KTP',
        'submitButton' : 'Submit',
        'cancelButton' : 'Cancel'

    },

    'userMenu' : {
        'home': 'Home',
        'claim': 'Claims',
        'profile': 'Profile'
    },

    'labelForPolicyStatus': {
        'paymementPending' : '',
    },

    'irene': {
        'irene1': 'Hi USER_NAME',
        'irene2': 'How may I assist you?',
        'irene3' : 'Please choose your policy, I will help you to get this claim sorted out in no time',
        'irene4' : 'Tell me USER_NAME, what really happened?',
        'irene5' : 'Sorry to hear that.. What are you claiming for?',
        'irene6': 'To proceed, the IMEI number will be reported to mobile carriers for blocking and the phone can no longer be used. Do you agree?',
        'irene7' : 'Please specify your damage?',
        'irene8' : 'How it happened?',
        'irene9' : 'Is this covered under warranty?',
        'irene10' : 'Let me know when it happened?',
        'irene11' : 'You have to pay the deductible of AMOUNT IDR for your claim. Do you want to proceed?',
        'irene12' : 'Upload a selfie video describing the incident',
        'irene13' : 'Place of incident',
        
        
        'irene14': 'For XXXX, blocking of IMEI number is mandatory. For more concern please contact customer care',
        'irene15': 'To proceed deduction of XXXX IDR is mandatory. For more concern please contact customer care',
        'irene16' : 'Did you file police report that states the details of break-in',
        'irene17': 'To proceed police report is mandatory. Please report to nearby police station',
        'irene18': 'Please upload a copy of police report',

        'irene19': 'Please wait I am proccessing your claim request',
        'irene20': "Thanks USER_NAME, We've got everything we need at this point, Your claim number is CLAIM_NO. Please wait for approval",

        'rep1': 'I would like to file a claim',
        'rep2': 'DEVICE_NAME',
        'rep3': 'DAMAGE_TYPE',
        'rep4': 'I would like to claim for REASON',
        'rep5a': 'I Accept',
        'rep5b': 'I Deny',
        'rep6': 'DAMAGE_PART',
        'rep7': 'HOW',
        'rep8': 'Yes, It is',
        'rep9': ' No, It not',
        'rep10': 'The incident took place on DATE_TIME',
        'rep11a': 'Yes, I will pay',
        'rep11b': 'No, I wont pay',
        'rep12': 'The incident took place on INCCIDENT_PLACE',
        'rep13a': 'Yes, I filed it',
        'rep13b' : "No, I didn't",
        'rep14' : "FILE_NAME",
        'rep15' : "VIDEO_NAME"
        
    }
}

