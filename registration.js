// GOOGLE APPS SCRIPT URL ───
var SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwj-x231ZNQnYaXi5Ju9LmMA11fUnC8UXfpMZv0XD-qYHvIpx3WorFL-5sRfqVcaDRe/exec';

var uppercaseIds = [
  'fullName','fatherName','motherName','guardian','religion',
  'permAt','permPo','permPs','permDistrict','permState',
  'localAt','localPo','localPs','localDistrict','localState'
];

var rules = [
  { id: 'fullName',       label: 'Full Name',          req: true,  type: 'text' },
  { id: 'gender',         label: 'Gender',              req: true,  type: 'select' },
  { id: 'dob',            label: 'Date of Birth',       req: true,  type: 'date' },
  { id: 'aadhaar',        label: 'Aadhaar Number',      req: true,  type: 'aadhaar' },
  { id: 'fatherName',     label: "Father's Name",       req: true,  type: 'text' },
  { id: 'motherName',     label: "Mother's Name",       req: true,  type: 'text' },
  { id: 'mobileSelf',     label: 'Mobile (Student)',    req: true,  type: 'phone' },
  { id: 'mobileGuardian', label: 'Mobile (Guardian)',   req: true,  type: 'phone' },
  { id: 'studentEmail',   label: 'Student Email',       req: true,  type: 'email' },
  { id: 'program',        label: 'Program',             req: true,  type: 'select' },
  { id: 'programType',    label: 'Program Type',        req: true,  type: 'select' },
  { id: 'permAt',         label: 'Perm. At',            req: true,  type: 'text' },
  { id: 'permPo',         label: 'Perm. Po',            req: true,  type: 'text' },
  { id: 'permPs',         label: 'Perm. Ps',            req: true,  type: 'text' },
  { id: 'permDistrict',   label: 'Perm. District',      req: true,  type: 'text' },
  { id: 'permState',      label: 'Perm. State',         req: true,  type: 'text' },
  { id: 'permPin',        label: 'Perm. Pin',           req: true,  type: 'pin' },
  { id: 'emergency',      label: 'Emergency Contact',   req: false, type: 'phone' },
  { id: 'parentsEmail',   label: 'Parents Email',       req: false, type: 'email' },
  { id: 'localAt',        label: 'Local At',            req: false, type: 'text' },
  { id: 'localPo',        label: 'Local Po',            req: false, type: 'text' },
  { id: 'localPs',        label: 'Local Ps',            req: false, type: 'text' },
  { id: 'localDistrict',  label: 'Local District',      req: false, type: 'text' },
  { id: 'localState',     label: 'Local State',         req: false, type: 'text' },
  { id: 'localPin',       label: 'Local Pin',           req: false, type: 'pin' },
];

function val(id) {
  var el = document.getElementById(id);
  return el ? el.value.trim() : '';
}

function ucVal(id) {
  var v = val(id);
  return uppercaseIds.indexOf(id) !== -1 ? v.toUpperCase() : v;
}

function setInvalid(id, show) {
  var el = document.getElementById(id);
  var err = document.getElementById('err-' + id);
  if (!el) return;
  if (show) {
    el.classList.add('invalid');
    if (err) err.classList.add('show');
  } else {
    el.classList.remove('invalid');
    if (err) err.classList.remove('show');
  }
}

function validateAll() {
  var valid = true;
  rules.forEach(function(r) {
    var v = val(r.id);
    var bad = false;
    if (r.req && !v) {
      bad = true;
    } else if (v) {
      if (r.type === 'phone'   && !/^\d{10}$/.test(v))                    bad = true;
      if (r.type === 'aadhaar' && !/^\d{12}$/.test(v))                    bad = true;
      if (r.type === 'pin'     && !/^\d{6}$/.test(v))                     bad = true;
      if (r.type === 'email'   && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) bad = true;
    }
    setInvalid(r.id, bad);
    if (bad) valid = false;
  });
  return valid;
}

function handleSubmitClick() {
  if (!validateAll()) {
    var first = document.querySelector('.invalid');
    if (first) first.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }
  openConfirmModal();
}

function buildAddress(prefix) {
  var parts = [];
  ['At','Po','Ps','District','State','Pin'].forEach(function(f) {
    var v = val(prefix + f);
    if (v) parts.push(f + '- ' + (uppercaseIds.indexOf(prefix+f) !== -1 ? v.toUpperCase() : v));
  });
  return parts.join(', ');
}

function openConfirmModal() {
  var fields = [
    { label: 'Full Name',        value: ucVal('fullName') },
    { label: 'Gender',           value: val('gender') },
    { label: 'Date of Birth',    value: val('dob') },
    { label: 'Aadhaar',          value: val('aadhaar').replace(/(\d{4})(\d{4})(\d{4})/, '$1-$2-$3') },
    { label: 'Father Name',      value: ucVal('fatherName') },
    { label: 'Mother Name',      value: ucVal('motherName') },
    { label: 'Mobile (Student)', value: '+91 ' + val('mobileSelf') },
    { label: 'Student Email',    value: val('studentEmail') },
    { label: 'Program',          value: val('program') + ' — ' + val('programType') },
    { label: 'Perm. Address',    value: buildAddress('perm') },
    { label: 'Emergency',        value: val('emergency') ? '+91 ' + val('emergency') : '—' },
  ];

  var html = fields.map(function(f) {
    return '<div class="check-row">'
      + '<div class="check-icon ok"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg></div>'
      + '<div><span class="check-label">' + f.label + ': </span><span class="check-value">' + f.value + '</span></div>'
      + '</div>';
  }).join('');

  document.getElementById('confirmFields').innerHTML = html;
  document.getElementById('confirmModal').classList.add('open');
}

function closeModal() {
  document.getElementById('confirmModal').classList.remove('open');
}

function closeSuccess() {
  document.getElementById('successModal').classList.remove('open');
  resetForm();
}

function confirmAndExport() {
  var btn = document.querySelector('.btn-confirm');
  btn.disabled = true;
  btn.innerHTML = '<svg viewBox="0 0 24 24" style="width:16px;height:16px;stroke:#fff;fill:none;stroke-width:2;animation:spin 1s linear infinite"><circle cx="12" cy="12" r="10" stroke-dasharray="31.4" stroke-dashoffset="10"/></svg> Submitting...';

  var row = {
    'Timestamp':          new Date().toLocaleString('en-IN'),
    'Full Name':          ucVal('fullName'),
    'Gender':             val('gender'),
    'Date of Birth':      val('dob'),
    'Category':           val('category'),
    'Religion':           ucVal('religion'),
    'Blood Group':        val('bloodGroup'),
    'Aadhaar Number':     val('aadhaar'),
    'Father Name':        ucVal('fatherName'),
    'Mother Name':        ucVal('motherName'),
    'Guardian Name':      ucVal('guardian'),
    'Mobile (Student)':   '+91' + val('mobileSelf'),
    'Mobile (Guardian)':  '+91' + val('mobileGuardian'),
    'Emergency Contact':  val('emergency') ? '+91' + val('emergency') : '',
    'Student Email':      val('studentEmail'),
    'Parents Email':      val('parentsEmail'),
    'Program':            val('program'),
    'Program Type':       val('programType'),
    'Perm At':            ucVal('permAt'),
    'Perm Po':            ucVal('permPo'),
    'Perm Ps':            ucVal('permPs'),
    'Perm District':      ucVal('permDistrict'),
    'Perm State':         ucVal('permState'),
    'Perm Pin':           val('permPin'),
    'Local At':           ucVal('localAt'),
    'Local Po':           ucVal('localPo'),
    'Local Ps':           ucVal('localPs'),
    'Local District':     ucVal('localDistrict'),
    'Local State':        ucVal('localState'),
    'Local Pin':          val('localPin'),
  };

  fetch(SCRIPT_URL, {
    method: 'POST',
    body: JSON.stringify(row)
  })
  .then(function(res) { return res.json(); })
  .then(function(data) {
    if (data.result === 'success') {
      closeModal();
      document.getElementById('successModal').classList.add('open');
    } else {
      alert('Server error. Please try again.');
      btn.disabled = false;
      btn.innerHTML = '<svg viewBox="0 0 24 24" style="width:16px;height:16px;stroke:#fff;fill:none;stroke-width:2.5"><polyline points="20 6 9 17 4 12"/></svg> Confirm & Submit';
    }
  })
  .catch(function() {
    alert('Network error. Check internet and try again.');
    btn.disabled = false;
    btn.innerHTML = '<svg viewBox="0 0 24 24" style="width:16px;height:16px;stroke:#fff;fill:none;stroke-width:2.5"><polyline points="20 6 9 17 4 12"/></svg> Confirm & Submit';
  });
}

function resetForm() {
  document.querySelectorAll('input, select').forEach(function(el) {
    if (el.tagName === 'SELECT') el.selectedIndex = 0;
    else el.value = '';
    el.classList.remove('invalid');
  });
  document.querySelectorAll('.field-error').forEach(function(e) { e.classList.remove('show'); });
  var btn = document.querySelector('.btn-confirm');
  if (btn) {
    btn.disabled = false;
    btn.innerHTML = '<svg viewBox="0 0 24 24" style="width:16px;height:16px;stroke:#fff;fill:none;stroke-width:2.5"><polyline points="20 6 9 17 4 12"/></svg> Confirm & Submit';
  }
}

document.addEventListener('DOMContentLoaded', function() {
  uppercaseIds.forEach(function(id) {
    var el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('input', function() {
      var pos = el.selectionStart;
      el.value = el.value.toUpperCase();
      el.setSelectionRange(pos, pos);
    });
  });
  document.querySelectorAll('input, select').forEach(function(el) {
    el.addEventListener('input', function() { el.classList.remove('invalid'); });
  });
});
