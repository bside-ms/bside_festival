# Store Raw Jury Votes And Calculate Curation Scores

The curation workflow stores only the anonymous jury votes entered during the shared review session and calculates jury score, bonus score, and final curation score from current application data. This avoids persisted score drift when application details such as FLINTA\* count, past participation, or postcodes are corrected, while accepting that score sorting and display must calculate these values at read time.
