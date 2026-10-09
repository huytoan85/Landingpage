import crmHandler from '../crm.js';

export default function handler(req, res) {
  if (req.method === 'POST') {
    req.body = Object.assign({}, req.body || {}, { action: 'sync-all' });
  }
  return crmHandler(req, res);
}
