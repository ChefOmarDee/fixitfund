import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { StoreImage } from '../../_lib/storeimage/storeimage.js';
import { storeS3pic } from '../../_lib/s3/pushpics.js';
import { AddNewProject } from '../../_lib/mongo/utils/addnewproject.js';

export async function POST(req) {
    const formData = await req.formData();
    const image = formData.get('image');
    const title = formData.get('title');
    const description = formData.get('description');
    const latitude = formData.get('latitude');
    const longitude = formData.get('longitude');
    const tag = formData.get('tag');
    const uid = formData.get('uid');

    if (!image) {
        return NextResponse.json(
            { error: 'No image file uploaded' },
            { status: 400 }
        );
    }

    if (!uid) {
        return NextResponse.json(
            { error: 'User ID is required' },
            { status: 400 }
        );
    }

    const timestamp = Date.now();
    const id = `${uuidv4()}_${timestamp}`;

    console.log('Received form data:', { id, title, description, latitude, longitude, tag, uid });
    console.log('Image details:', { name: image.name, type: image.type, size: image.size });

    try {
        const filePath = await StoreImage(id, image);
        const s3FileName = await storeS3pic(filePath);
        const projectData = {
            title,
            description,
            latitude,
            longitude,
            tag,
            uid,
            wid: '',
            cost: 0,
            projectId: id,
            pictureUrl: `https://fixitfund.s3.amazonaws.com/${s3FileName}`,
            donated: 0,
            status: 'open',
        };
        console.log('Picture URL:', projectData.pictureUrl);
        await AddNewProject(projectData);

        return NextResponse.json({ message: 'Data received and processed successfully', s3FileName }, { status: 200 });
    } catch (error) {
        console.error('Error in POST handler:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}