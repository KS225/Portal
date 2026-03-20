import mongoose from "mongoose";

const certificationSchema = new mongoose.Schema(
{
  company:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
  },

  /* BASIC INFO */

  businessType:String,
  productsAndServices:String,
  yearsInOperation:Number,
  numberOfCustomers:Number,

 /* SECTION 1 – GOVERNANCE */

organisationStructure:String,
rolesResponsibilities:String,
salesDeliverySeparation:String,
escalationFramework:String,
managementReview:String,
// orgEvidence:String,

/* SECTION 2 – BUSINESS MODEL */

productServiceDefinition:String,
revenueMixTransparency:String,
implementationScopeDefined:String,
warrantySupportClarity:String,
thirdPartyDependencies:String,

/* SECTION 3 – SALES */

standardProposalTemplate:String,
scopeDefined:String,
riskDisclosure:String,
deliverySignoff:String,
noMisleadingGuarantee:String,

/* SECTION 9 – SDLC */

sdlcDefined:String,
versionControl:String,
releaseManagement:String,
defectTracking:String,
productRoadmap:String,
eolPolicy:String,

/* SECTION 13 – SECURITY */

securityPolicy:String,
riskAssessment:String,
accessControl:String,
encryptionUsed:String,
backupRecovery:String,
incidentManagement:String,

  /* AUDITOR */

  auditorRemarks:{
    type:String,
    default:""
  },

  auditorDecision:{
    type:String,
    default:""
  },

  assignedAuditor:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    default:null
  },
  certificateUrl: {
  type: String,
  default: ""
},

  status:{
    type:String,
    enum:[
      "Pending",
      "Auditor Assigned",
      "Under Audit",
      "Changes Requested",
      "Approved",
      "Rejected"
    ],
    default:"Pending"
  }

  

},
{timestamps:true}
);

export default mongoose.model("Certification",certificationSchema);