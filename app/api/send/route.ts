import { ProgramEmailTemplate } from '@/components/email-template';
import { NextResponse } from 'next/server';
import { ReactElement } from 'react';
import { Resend } from 'resend';
import { format } from 'util';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  const body = await request.json();
  try {
    const data = await resend.emails.send({
      from: 'Fortuin Funeral Home <no-reply@skywalkersoftware.tech>',
      to: ['warrenjonas1@gmail.com', 'jonaswarren9@gmail.com'],
      subject: 'New Enquiry for Morpies CD',
      react: ProgramEmailTemplate({
        name: body.name,
        link: body.link,
      }) as ReactElement,
    });

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error });
  }
}
