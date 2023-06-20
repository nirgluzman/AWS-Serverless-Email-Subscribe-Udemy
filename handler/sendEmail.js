import sgMail from '@sendgrid/mail';
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

import axios from 'axios';

export const sendEmail = async (event) => {
  console.log('event', event);

  try {
    const randQuote = await getQuote();
    const emailHTML = createEmailHTML(randQuote);

    const subsEmail = await getSubsEmail();

    const msg = {
      to: subsEmail, // recipients
      from: 'nir.gluzman@gmail.com', // Verified sender
      subject: 'Daily words of wisdom',
      text: 'Get inspired today',
      html: emailHTML,
    };

    await sgMail.sendMultiple(msg);

    return {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Methods': '*',
        'Access-Control-Allow-Origin': '*',
      },
      statusCode: 200,
      body: JSON.stringify({ message: 'Ok' }),
    };
  } catch (error) {
    console.error(error);
    return {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Methods': '*',
        'Access-Control-Allow-Origin': '*',
      },
      statusCode: 500,
      body: JSON.stringify(error.message),
    };
  }
};

const getSubsEmail = async () => {
  const subscribers = await axios.get(
    'https://x5krb1cbe6.execute-api.us-east-1.amazonaws.com/dev/get-subscribers'
  );

  return subscribers.data.map((sub) => sub.email);
};

const getQuote = async () => {
  const getQuotes = await axios.get(
    'https://x5krb1cbe6.execute-api.us-east-1.amazonaws.com/dev/quotes'
  );
  const length = getQuotes.data.quotes.length;
  const randomQuote = getQuotes.data.quotes[Math.floor(Math.random() * length)];

  return randomQuote;
};

const createEmailHTML = (randQuote) => {
  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
      <html lang="en">
     
      
      <body>
        <div class="container", style="min-height: 40vh;
        padding: 0 0.5rem;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;"> 
         <div class="card" style="margin-left: 20px;margin-right: 20px;">
            <div style="font-size: 14px;">
            <div class='card' style=" background: #f0c5c5;
            border-radius: 5px;
            padding: 1.75rem;
            font-size: 1.1rem;
            font-family: Menlo, Monaco, Lucida Console, Liberation Mono,
              DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace;">
        
          <p>${randQuote.quote}</p>
          <blockquote>by ${randQuote.author}</blockquote>
        
      </div>
            <br>
            </div>
            
           
            <div class="footer-links" style="display: flex;justify-content: center;align-items: center;">
              <a href="/" style="text-decoration: none;margin: 8px;color: #9CA3AF;">Unsubscribe?</a>
              <a href="/" style="text-decoration: none;margin: 8px;color: #9CA3AF;">About Us</a>
           
            </div>
            </div>
        
              </div>
             
      </body>
      </html>`;
};
