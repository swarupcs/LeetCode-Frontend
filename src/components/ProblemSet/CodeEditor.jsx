

import { useEffect, useRef } from 'react';



export default function CodeEditor({ language }) {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // This is a placeholder for a real code editor integration
    // In a real implementation, you would integrate Monaco Editor, CodeMirror, or similar
    if (editorRef.current) {
      const sampleCode = getSampleCode(language);
      editorRef.current.textContent = sampleCode;
    }
  }, [language]);

  return (
    <div className='h-full w-full overflow-auto bg-zinc-900 p-4'>
      <pre
        ref={editorRef}
        className='font-mono text-sm text-zinc-100'
        style={{
          fontFamily: 'JetBrains Mono, Menlo, Monaco, Consolas, monospace',
          lineHeight: 1.5,
        }}
      >
        {getSampleCode(language)}
      </pre>
    </div>
  );
}

function getSampleCode(language) {
  switch (language) {
    case 'javascript':
      return `/**
 * @param {number[]} nums
 * @return {number}
 */
var singleNonDuplicate = function(nums) {
    let left = 0;
    let right = nums.length - 1;
    
    while (left < right) {
        let mid = Math.floor((left + right) / 2);
        
        // Make sure mid is even
        if (mid % 2 === 1) {
            mid--;
        }
        
        // If the pair doesn't match, the single element is on the left
        if (nums[mid] !== nums[mid + 1]) {
            right = mid;
        } else {
            // The pair matches, so the single element is on the right
            left = mid + 2;
        }
    }
    
    return nums[left];
};`;
    case 'python':
      return `class Solution:
    def singleNonDuplicate(self, nums: List[int]) -> int:
        left, right = 0, len(nums) - 1
        
        while left < right:
            mid = (left + right) // 2
            
            # Make sure mid is even
            if mid % 2 == 1:
                mid -= 1
                
            # If the pair doesn't match, the single element is on the left
            if nums[mid] != nums[mid + 1]:
                right = mid
            else:
                # The pair matches, so the single element is on the right
                left = mid + 2
                
        return nums[left]`;
    case 'java':
      return `class Solution {
    public int singleNonDuplicate(int[] nums) {
        int left = 0;
        int right = nums.length - 1;
        
        while (left < right) {
            int mid = (left + right) / 2;
            
            // Make sure mid is even
            if (mid % 2 == 1) {
                mid--;
            }
            
            // If the pair doesn't match, the single element is on the left
            if (nums[mid] != nums[mid + 1]) {
                right = mid;
            } else {
                // The pair matches, so the single element is on the right
                left = mid + 2;
            }
        }
        
        return nums[left];
    }
}`;
    case 'cpp':
      return `class Solution {
public:
    int singleNonDuplicate(vector<int>& nums) {
        int left = 0;
        int right = nums.size() - 1;
        
        while (left < right) {
            int mid = (left + right) / 2;
            
            // Make sure mid is even
            if (mid % 2 == 1) {
                mid--;
            }
            
            // If the pair doesn't match, the single element is on the left
            if (nums[mid] != nums[mid + 1]) {
                right = mid;
            } else {
                // The pair matches, so the single element is on the right
                left = mid + 2;
            }
        }
        
        return nums[left];
    }
};`;
    default:
      return '// Select a language to see sample code';
  }
}
