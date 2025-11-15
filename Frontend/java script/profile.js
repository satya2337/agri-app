const editBtn = document.getElementById('edit-btn');
const inputs = document.querySelectorAll('#profile-form input');

editBtn.addEventListener('click', function() {
    if (editBtn.textContent === 'Edit Profile') {
        // Enable inputs for editing
        inputs.forEach(input => input.disabled = false);
        editBtn.textContent = 'Save Profile';  // Change button to 'Save'
        editBtn.style.backgroundColor = '#007bff';  // Change color to indicate save
    } else {
        // Disable inputs again after editing
        inputs.forEach(input => input.disabled = true);
        editBtn.textContent = 'Edit Profile';  // Change button back to 'Edit'
        editBtn.style.backgroundColor = '#4CAF50';  // Revert to original color
        
        // Optional: Here you can handle saving the updated data
        console.log('Profile Updated');
    }
});
