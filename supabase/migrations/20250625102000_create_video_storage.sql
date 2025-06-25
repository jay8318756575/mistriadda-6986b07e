
-- Create storage bucket for mistri videos
INSERT INTO storage.buckets (id, name, public) 
VALUES ('mistri-videos', 'mistri-videos', true);

-- Create storage policies for the mistri-videos bucket
CREATE POLICY "Allow public read access to mistri videos" ON storage.objects
FOR SELECT USING (bucket_id = 'mistri-videos');

CREATE POLICY "Allow authenticated upload to mistri videos" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'mistri-videos');

CREATE POLICY "Allow users to update their own video files" ON storage.objects
FOR UPDATE USING (bucket_id = 'mistri-videos');

CREATE POLICY "Allow users to delete their own video files" ON storage.objects
FOR DELETE USING (bucket_id = 'mistri-videos');
