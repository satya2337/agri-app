const editBtn = document.getElementById('edit-settings-btn');
const saveBtn = document.getElementById('save-settings-btn');
const inputs = document.querySelectorAll('#settings-form input');

editBtn.addEventListener('click', function() {
    // Enable all inputs for editing
    inputs.forEach(input => input.disabled = false);
    
    // Show Save button and hide Edit button
    editBtn.style.display = 'none';
    saveBtn.style.display = 'inline-block';
});

saveBtn.addEventListener('click', function(event) {
    event.preventDefault();
    
    // Save the new settings (You can implement actual save logic here)
    console.log('Settings saved!');

    // Disable inputs again after saving
    inputs.forEach(input => input.disabled = true);

    // Show Edit button and hide Save button
    editBtn.style.display = 'inline-block';
    saveBtn.style.display = 'none';
});
