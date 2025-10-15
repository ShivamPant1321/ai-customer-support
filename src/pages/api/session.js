import prisma from '../../lib/db.js';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    // Create new session
    try {
      const { userId } = req.body;
      
      const session = await prisma.session.create({
        data: {
          userId: userId || null,
          lastActiveAt: new Date()
        }
      });

      return res.status(201).json(session);
    } catch (error) {
      console.error('Error creating session:', error);
      return res.status(500).json({ error: 'Failed to create session' });
    }
  } 
  
  else if (req.method === 'GET') {
    // Get session by ID
    try {
      const { id } = req.query;
      
      if (!id) {
        return res.status(400).json({ error: 'Session ID is required' });
      }

      const session = await prisma.session.findUnique({
        where: { id },
        include: {
          messages: {
            orderBy: { createdAt: 'asc' }
          }
        }
      });

      if (!session) {
        return res.status(404).json({ error: 'Session not found' });
      }

      return res.status(200).json(session);
    } catch (error) {
      console.error('Error fetching session:', error);
      return res.status(500).json({ error: 'Failed to fetch session' });
    }
  }
  
  else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}
