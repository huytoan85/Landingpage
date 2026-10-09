import crmHandler from './crm.js';

export default function handler(req, res) {
  req.url = '/api/export-csv';
  return crmHandler(req, res);
}
