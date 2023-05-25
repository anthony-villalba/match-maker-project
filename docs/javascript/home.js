const profileCount = document.getElementById('userCount')

$.get('/friends.json', (data) => {
    profileCount.innerHTML = data.length
})