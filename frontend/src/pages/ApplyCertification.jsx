import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/certification.css";

function ApplyCertification(){

const navigate = useNavigate();

const [step,setStep] = useState(1);
const [isEditMode, setIsEditMode] = useState(false);
const [editId, setEditId] = useState(null);

const [formData,setFormData] = useState({

businessType:"",
productsAndServices:"",
yearsInOperation:"",
numberOfCustomers:"",

organisationStructure:"",
rolesResponsibilities:"",
salesDeliverySeparation:"",
escalationFramework:"",
managementReview:"",

productServiceDefinition:"",
revenueMixTransparency:"",
implementationScopeDefined:"",
warrantySupportClarity:"",
thirdPartyDependencies:"",

sdlcDefined:"",
versionControl:"",
releaseManagement:"",
defectTracking:"",
productRoadmap:"",
eolPolicy:"",

securityPolicy:"",
riskAssessment:"",
accessControl:"",
encryptionUsed:"",
backupRecovery:"",
incidentManagement:"",

// orgEvidence:null

});

const handleChange=(e)=>{

const {name,value}=e.target;

setFormData({
...formData,
[name]:value
});

};

// const handleFile=(e)=>{

// setFormData({
// ...formData,
// orgEvidence:e.target.files[0]
// });

// };

const prevStep=()=>setStep(step-1);

const nextStep = () => {

const requiredFields = {

1:["businessType","productsAndServices","yearsInOperation","numberOfCustomers"],

2:["organisationStructure","rolesResponsibilities","salesDeliverySeparation","escalationFramework","managementReview"],

3:["productServiceDefinition","revenueMixTransparency","implementationScopeDefined","warrantySupportClarity","thirdPartyDependencies"],

4:["sdlcDefined","versionControl","releaseManagement","defectTracking","productRoadmap","eolPolicy"],

5:["securityPolicy","riskAssessment","accessControl","encryptionUsed","backupRecovery","incidentManagement"]

};

const fields = requiredFields[step];

const missing = fields.some(field => !formData[field]);

if(missing){
alert("Please complete all questions before continuing.");
return;
}

setStep(step+1);

};

useEffect(()=>{

localStorage.setItem(
"certDraft",
JSON.stringify(formData)
);

},[formData]);

useEffect(()=>{

const draft=localStorage.getItem("certDraft");

if(draft){
setFormData(JSON.parse(draft));
}

},[]);
useEffect(() => {

  const editData = localStorage.getItem("editApplication");

  if (editData) {
    const parsed = JSON.parse(editData);
    setFormData(parsed);
    setIsEditMode(true);
    setEditId(parsed._id);
    return;
  }

  const draft = localStorage.getItem("certDraft");

  if (draft) {
    setFormData(JSON.parse(draft));
  }

}, []);

useEffect(() => {
  if (!isEditMode) {
    localStorage.setItem("certDraft", JSON.stringify(formData));
  }
}, [formData, isEditMode]);

const handleSubmit = async (e) => {

  e.preventDefault();

  const token = localStorage.getItem("token");

  try {

    // ✅ Decide API
    const url = isEditMode
      ? `http://localhost:5000/api/certification/update/${editId}`
      : "http://localhost:5000/api/certification/apply";

    const method = isEditMode ? "PUT" : "POST";

    // ✅ Send JSON (NOT FormData)
    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(formData)
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message);
      return;
    }

    alert(isEditMode 
      ? "Application updated successfully" 
      : "Application submitted successfully"
    );

    // ✅ Clear storage
    localStorage.removeItem("certDraft");
    localStorage.removeItem("editApplication");

    navigate("/dashboard/audit");

  } catch (err) {
    console.error(err);
    alert("Server error");
  }
};

return(

<div className="cert-container">

<div className="cert-card">

<h2>Certification Application</h2>

{/* PROGRESS TRACKER */}

<div className="progress-tracker">

{["Company","Governance","Business","SDLC","Security"].map((label,index)=>(

<div key={index} className={`tracker-step ${step>=index+1?"active":""}`}>
<span>{index+1}</span>
<p>{label}</p>
</div>

))}

</div>

<form onSubmit={handleSubmit}>

{step===1 &&(

<div>

<h3>Company Information</h3>

<div className="company-grid">

<div>
<label>Business Type</label>

<select
name="businessType"
value={formData.businessType}
onChange={handleChange}
required
>
<option value="">Select</option>
<option value="Software Product">Software Product</option>
<option value="Software Services">Software Services</option>
<option value="Both">Both</option>
</select>
</div>

<div>
<label>Years in Operation</label>

<select name="yearsInOperation" onChange={handleChange}>
<option value="">Select</option>
<option value="0">Less than 1 year</option>
<option value="1">1-2 years</option>
<option value="3">3-5 years</option>
<option value="5">5+ years</option>
</select>
</div>

<div>
<label>Number of Customers</label>

<input
type="number"
name="numberOfCustomers"
value={formData.numberOfCustomers}
onChange={handleChange}
min="0"
step="1"
placeholder="Enter number of customers"
required
/>
</div>

<div>
<label>Products / Services</label>

<textarea
name="productsAndServices"
value={formData.productsAndServices}
onChange={handleChange}
required
/>
</div>

</div>

<div className="step-buttons">
<button type="button" onClick={nextStep}>Next</button>
</div>

</div>

)}



{/* STEP 2 */}

{step===2 &&(

<div>

<h3>SECTION 1 – Governance</h3>

{[
["organisationStructure","Defined organisation structure"],
["rolesResponsibilities","Roles & responsibilities defined"],
["salesDeliverySeparation","Sales / Delivery separation"],
["escalationFramework","Escalation framework"],
["managementReview","Management review process"]
].map(([field,label])=>(

<div className="question-row" key={field}>

<label>{label}</label>

<div className="options">

<label><input type="radio" name={field} value="Yes" checked={formData[field]==="Yes"} onChange={handleChange}/>Yes</label>
<label><input type="radio" name={field} value="No" checked={formData[field]==="No"} onChange={handleChange}/>No</label>
<label><input type="radio" name={field} value="NA" checked={formData[field]==="NA"} onChange={handleChange}/>NA</label>

</div>

</div>

))}
  {/* <label>Upload Evidence</label>

              <input
                type="file"
                name="orgEvidence"
                onChange={handleFile}
                accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"
              />

            //   {/* ✅ Show selected file */}
            {/* //   {formData.orgEvidence && ( */}
            {/* //     <p>Selected: {formData.orgEvidence.name}</p>
            //   )} */} 


<div className="step-buttons">
<button type="button" onClick={prevStep}>Back</button>
<button type="button" onClick={nextStep}>Next</button>
</div>

</div>

)}

{/* STEP 3 */}

{step===3 &&(

<div>

<h3>SECTION 2 – Business Model</h3>

{[
["productServiceDefinition","Product / service clearly defined"],
["revenueMixTransparency","Revenue mix transparency"],
["implementationScopeDefined","Implementation scope defined"],
["warrantySupportClarity","Warranty vs support clarity"],
["thirdPartyDependencies","Third party dependency disclosure"]
].map(([field,label])=>(

<div className="question-row" key={field}>

<label>{label}</label>

<div className="options">

<label><input type="radio" name={field} value="Yes" checked={formData[field]==="Yes"} onChange={handleChange}/>Yes</label>
<label><input type="radio" name={field} value="No" checked={formData[field]==="No"} onChange={handleChange}/>No</label>
<label><input type="radio" name={field} value="NA" checked={formData[field]==="NA"} onChange={handleChange}/>NA</label>

</div>

</div>

))}

<div className="step-buttons">
<button type="button" onClick={prevStep}>Back</button>
<button type="button" onClick={nextStep}>Next</button>
</div>

</div>

)}

{/* STEP 4 */}

{step===4 &&(

<div>

<h3>SECTION 9 – SDLC</h3>

{[
["sdlcDefined","SDLC defined"],
["versionControl","Version control used"],
["releaseManagement","Release management process"],
["defectTracking","Defect tracking system"],
["productRoadmap","Product roadmap defined"],
["eolPolicy","End of life policy"]
].map(([field,label])=>(

<div className="question-row" key={field}>

<label>{label}</label>

<div className="options">

<label><input type="radio" name={field} value="Yes" checked={formData[field]==="Yes"} onChange={handleChange}/>Yes</label>
<label><input type="radio" name={field} value="No" checked={formData[field]==="No"} onChange={handleChange}/>No</label>
<label><input type="radio" name={field} value="NA" checked={formData[field]==="NA"} onChange={handleChange}/>NA</label>

</div>

</div>

))}

<div className="step-buttons">
<button type="button" onClick={prevStep}>Back</button>
<button type="button" onClick={nextStep}>Next</button>
</div>

</div>

)}

{/* STEP 5 */}

{step===5 &&(

<div>

<h3>SECTION 13 – Security</h3>

{[
["securityPolicy","Security policy defined"],
["riskAssessment","Risk assessment performed"],
["accessControl","Access control system"],
["encryptionUsed","Encryption used"],
["backupRecovery","Backup & recovery process"],
["incidentManagement","Incident management process"]
].map(([field,label])=>(

<div className="question-row" key={field}>

<label>{label}</label>

<div className="options">

<label><input type="radio" name={field} value="Yes" checked={formData[field]==="Yes"} onChange={handleChange}/>Yes</label>
<label><input type="radio" name={field} value="No" checked={formData[field]==="No"} onChange={handleChange}/>No</label>
<label><input type="radio" name={field} value="NA" checked={formData[field]==="NA"} onChange={handleChange}/>NA</label>

</div>

</div>

))}

<div className="step-buttons">
<button type="button" onClick={prevStep}>Back</button>
<button type="submit">Submit Application</button>
</div>

</div>

)}

</form>

</div>

</div>

);

}

export default ApplyCertification;