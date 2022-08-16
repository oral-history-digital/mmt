import { filesEndPoint } from '../../modules/api';

export default async function registerFile(data) {
    const res = await fetch(filesEndPoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    const json = await res.json();

    return json.id;
}
