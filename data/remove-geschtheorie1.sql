-- GeschTheorie1-Gebäude aus der Karte nehmen (Daten bleiben in DB)
UPDATE gebaeude SET status = 'rejected' WHERE modul = 'GeschTheorie1';
