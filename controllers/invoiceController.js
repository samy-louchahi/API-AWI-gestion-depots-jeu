// invoiceController.js
const { Invoice, Sale, Buyer, SaleDetail, DepositGame, Game } = require('../models');
const { v4: uuidv4 } = require('uuid');
const PDFDocument = require('pdfkit');
const fs = require('fs');

module.exports = {
  /**
   * Créer une facture en référence à une vente.
   * POST /api/invoices
   * Body : { sale_id, buyer_id? }
   */
  async createInvoice(req, res) {
    try {
      const { sale_id, buyer_id } = req.body;

      // Vérifie que la vente existe
      const sale = await Sale.findByPk(sale_id);
      if (!sale) {
        return res.status(404).json({ error: 'Sale not found' });
      }

      // Génère un numéro de facture
      const invoiceNumber = 'INV-' + new Date().getFullYear() + '-' + uuidv4().substr(0, 8);

      // Crée l'Invoice
      const newInvoice = await Invoice.create({
        invoice_number: invoiceNumber,
        sale_id,
        buyer_id: buyer_id || sale.buyer_id, // si on veut pointer un buyer explicite, sinon prendre celui de la sale
        date: new Date()
      });

      return res.status(201).json(newInvoice);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  },

  /**
   * Récupérer toutes les factures : GET /api/invoices
   */
  async findAllInvoices(req, res) {
    try {
      const invoices = await Invoice.findAll({
        include: [ { model: Sale }, { model: Buyer } ]
      });
      return res.json(invoices);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  },

  /**
   * Récupérer une facture par ID : GET /api/invoices/:id
   * Y compris les détails de la vente pour construire le PDF/HTML
   */
  async findInvoiceById(req, res) {
    try {
      const { id } = req.params;
      const invoice = await Invoice.findByPk(id, {
        include: [
          { model: Sale, include: [
            { model: Buyer },
            // Si tu veux inclure le detail 
            { model: SaleDetail, include: [ DepositGame ] }
          ] },
          { model: Buyer } 
        ]
      });
      if (!invoice) {
        return res.status(404).json({ error: 'Invoice not found' });
      }

      // Optionnel: Tu peux générer ici un "objet" complet qui rassemble
      // toutes les infos (buyer, items vendus, total, etc.)
      // Par exemple:
      const sale = invoice.Sale;
      const buyer = sale.Buyer || invoice.Buyer; // si tu veux prioriser un buyer
      let totalPrice = 0;
      const items = [];

      if (sale.SaleDetails) {
        for (const detail of sale.SaleDetails) {
          const dg = detail.DepositGame;
          const itemPrice = dg.price; // ex
          const lineTotal = itemPrice * detail.quantity;
          totalPrice += lineTotal;

          items.push({
            deposit_game_id: dg.deposit_game_id,
            label: dg.label,
            quantity: detail.quantity,
            price: itemPrice
          });
        }
      }

      // Construire un objet de réponse plus complet
      const invoiceData = {
        invoice_number: invoice.invoice_number,
        date: invoice.date,
        buyer: buyer ? {
          name: buyer.name,
          email: buyer.email,
          phone: buyer.phone,
          address: buyer.address
        } : null,
        sale_date: sale.sale_date,
        items,
        totalPrice
      };

      return res.json({ invoice, invoiceData });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  },

  /**
   * Mettre à jour une facture : PUT /api/invoices/:id
   */
  async updateInvoice(req, res) {
    try {
      const { id } = req.params;
      const { buyer_id, sale_id, invoice_number, date } = req.body;

      const invoice = await Invoice.findByPk(id);
      if (!invoice) {
        return res.status(404).json({ error: 'Invoice not found' });
      }

      if (buyer_id !== undefined) {
        // Vérifier si ce buyer existe
        // ...
        invoice.buyer_id = buyer_id;
      }

      if (sale_id !== undefined) {
        // Vérifier si la sale existe
        // ...
        invoice.sale_id = sale_id;
      }

      if (invoice_number !== undefined) {
        invoice.invoice_number = invoice_number;
      }

      if (date !== undefined) {
        invoice.date = date;
      }

      await invoice.save();
      return res.json(invoice);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  },

  /**
   * Supprimer une facture : DELETE /api/invoices/:id
   */
  async deleteInvoice(req, res) {
    try {
      const { id } = req.params;
      const invoice = await Invoice.findByPk(id);
      if (!invoice) {
        return res.status(404).json({ error: 'Invoice not found' });
      }

      await invoice.destroy();
      return res.json({ message: 'Invoice deleted successfully' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  },
  async generateInvoicePDF(req, res) {
    try {
      const { sale_id } = req.params;
      const { buyer_id } = req.body;
      console.log('Headers reçus :', req.headers);
      console.log('Body reçu :', req.body);
      console.log('Params reçus :', req.params);
      // Vérifie que la vente existe
      console.log('Vérification de sale_id:', sale_id);
      const sale = await Sale.findByPk(sale_id, {
        include: [
          { model: Buyer },
          { 
            model: SaleDetail, 
            include: [{model: DepositGame, include: [Game]}] 
          }
        ]
      });
      console.log('Vérification de sale:', sale);
      if (!sale) {
        return res.status(404).json({ error: 'Sale not found' });
      }

      // Génère un numéro de facture unique
      const invoiceNumber = 'INV-' + new Date().getFullYear() + '-' + uuidv4().substr(0, 8);

      // Crée la nouvelle facture
      const newInvoice = await Invoice.create({
        invoice_number: invoiceNumber,
        sale_id : sale_id,
        buyer_id: buyer_id || sale.buyer_id, // Utilise l'acheteur fourni ou celui associé à la vente
        date: new Date()
      });

      // Configuration des en-têtes pour le PDF
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=facture-${newInvoice.invoice_number}.pdf`);
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      res.setHeader('Surrogate-Control', 'no-store');

      // Créer le PDF
      const doc = new PDFDocument();
      doc.pipe(res);

      // Contenu de la facture
      doc.fontSize(20).text(`Facture #${newInvoice.invoice_number}`, { align: 'center' });
      doc.moveDown();
      doc.fontSize(14).text(`Date : ${new Date(newInvoice.date).toLocaleDateString()}`);

      // Infos sur l'acheteur
      if (sale.Buyer) {
        doc.text(`Acheteur : ${sale.Buyer.name}`);
        doc.text(`Email : ${sale.Buyer.email}`);
        if (sale.Buyer.address) {
          doc.text(`Adresse : ${sale.Buyer.address}`);
        }
      } else {
        doc.text('Acheteur : Données indisponibles');
      }

      doc.moveDown();
      doc.text('Détails de la vente :', { underline: true });
      let totalAmount = 0;
      console.log('Détails de la vente :', sale.SaleDetails);
      sale.SaleDetails.forEach((detail) => {
        const gameName = detail.DepositGame?.Game?.name || 'Jeu inconnu';
        const quantity = detail.quantity;
      
        // Récupérer les exemplaires en tant que tableau pour faciliter l’itération
        const exemplairesArray = Object.values(detail.DepositGame?.exemplaires || {});
      
        // Parcourir les premiers `quantity` exemplaires et calculer la somme
        let lineTotal = 0;
        for (let i = 0; i < quantity && i < exemplairesArray.length; i++) {
          lineTotal += exemplairesArray[i].price || 0;
        }
      
        totalAmount += lineTotal;
      
        doc.text(`- ${gameName} : ${quantity} x ${(lineTotal / quantity).toFixed(2)} € = ${lineTotal.toFixed(2)} €`);
      });

      doc.moveDown();
      doc.fontSize(16).text(`Total : ${totalAmount.toFixed(2)} €`, { align: 'right' });

      // Fin et envoi du PDF
      doc.end();
    } catch (error) {
      console.error('Erreur lors de la création de la facture et du PDF :', error);
      res.status(500).json({ error: 'Erreur lors de la création de la facture ou du PDF' });
    }
  }
};