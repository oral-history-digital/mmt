export default async function registerFile(data) {
    const res = await fetch('http://localhost:3000/files', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    const json = await res.json();

    return json.id;
}
