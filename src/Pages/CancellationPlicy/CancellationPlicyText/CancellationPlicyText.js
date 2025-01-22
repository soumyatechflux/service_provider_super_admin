
import React, { useState,useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; 
import { Button } from '@mui/material';
import { toast } from 'react-toastify';
import axios from 'axios';

const CancellationPlicyText = () => {
  const [editorContent, setEditorContent] = useState('');
  const [loading, setLoading] = useState(false);

  const token = sessionStorage.getItem('TokenForSuperAdminOfServiceProvider');
  const baseURL = process.env.REACT_APP_SERVICE_PROVIDER_SUPER_ADMIN_BASE_API_URL;

   useEffect(() => {
      const fetchcancellationPolicy = async () => {
        try {
          const response = await axios.get(
            `${baseURL}/api/admin/cms/cancellation_policy`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
  
          if (response?.data?.success) {
            const content = response?.data?.data?.content || '';
            setEditorContent(content);
          } else {
            toast.error(response?.data?.message || 'Failed to load Cancellation Policy.');
          }
        } catch (error) {
          console.error('Error fetching Cancellation policy:', error);
          toast.error('Failed to load Cancellation Policy. Please try again.');
        }
      };
  
      fetchcancellationPolicy();
    }, [baseURL, token]);
  
  const handleChange = (value) => {
    setEditorContent(value);
  };

  const handleSave = async () => {
      if (!editorContent) {
        toast.error('Please enter some text before saving.');
        return;
      }
  
      setLoading(true);
  
      try {
        const response = await axios.patch(
          `${baseURL}/api/admin/cms/cancellation_policy`,
          { 
            title: "Cancellation policy", 
            content: editorContent 
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
  
        if (response?.data?.success) {
          toast.success('Cancellation Policy saved successfully!');
        } else {
          toast.error(response?.data?.message || 'Failed to save Cancellation Policy.');
        }
      } catch (error) {
        console.error('Error saving Cancellation Policy:', error);
        toast.error('Failed to save Cancellation Policy. Please try again.');
      } finally {
        setLoading(false);
      }
    };
  
  return (
    <div>
      <h2>Cancellation Policy</h2>
      <ReactQuill
        value={editorContent}
        onChange={handleChange}
        modules={{
          toolbar: [
            [{ header: '1' }, { header: '2' }, { font: [] }],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['bold', 'italic', 'underline'],
            ['link'],
            ['blockquote'],
            [{ align: [] }],
            ['image', 'code-block'],
          ],
        }}
        formats={[
          'header',
          'font',
          'list',
          'bold',
          'italic',
          'underline',
          'link',
          'blockquote',
          'align',
          'image',
          'code-block',
        ]}
        placeholder="Enter your cancellation policy here..."
        style={{ height: '350px', width: '100%' }} 
      />
      <div style={{ marginTop: '60px', textAlign: 'center' }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
          disabled={loading}
          style={{width:"50%"}}
        >
          {loading ? 'Saving...' : 'Save Cancellation Policy'}
        </Button>
      </div>
    </div>
  );
};

export default CancellationPlicyText;
