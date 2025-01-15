
import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; 
import { Button } from '@mui/material';
import { toast } from 'react-toastify';
import axios from 'axios';

const RefundPolicyText = () => {
  const [editorContent, setEditorContent] = useState('');
  const [loading, setLoading] = useState(false);

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
      const token = sessionStorage.getItem('TokenForSuperAdminOfServiceProvider');
      const response = await axios.post(
        `${process.env.REACT_APP_SERVICE_PROVIDER_SUPER_ADMIN_BASE_API_URL}/api/admin/cms/terms-and-conditions`,
        { content: editorContent },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response?.data?.success) {
        toast.success('Refund Policy saved successfully!');
      } else {
        toast.error(response?.data?.message || 'Failed to save Refund Policy.');
      }
    } catch (error) {
      console.error('Error saving Refund Policy:', error);
      toast.error('Failed to save Refund Policy. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Refund Policy</h2>
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
        placeholder="Enter your Refund Policy here..."
        style={{ height: '350px', width: '100%' }} 
      />
      <div style={{ marginTop: '60px' }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
          disabled={loading}
          style={{width:"100%"}}
        >
          {loading ? 'Saving...' : 'Save Refund Policy'}
        </Button>
      </div>
    </div>
  );
};

export default RefundPolicyText;
