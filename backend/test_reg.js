async function test() {
    try {
        const res = await fetch('http://127.0.0.1:5000/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: `test${Date.now()}@test.com`, password: 'password123' })
        });
        const data = await res.json();
        console.log('Status:', res.status, 'Response:', data);
    } catch (err) {
        console.log('Error:', err.message);
    }
}
test();
